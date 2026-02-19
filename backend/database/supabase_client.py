import os
from dotenv import load_dotenv
from pathlib import Path
try:
    from supabase import create_client, Client
    SUPABASE_SDK_AVAILABLE = True
except ImportError:
    SUPABASE_SDK_AVAILABLE = False
    print("WARNING: supabase library not installed, falling back to psycopg2")
    import psycopg2
    from psycopg2.extras import RealDictCursor
    from contextlib import contextmanager

# Load environment variables from backend/.env
backend_dir = Path(__file__).parent.parent
load_dotenv(backend_dir / '.env')

if SUPABASE_SDK_AVAILABLE:
    # Use Supabase REST API (works better with network issues)
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
    
    _supabase_client: Client = None
    
    def get_supabase_client() -> Client:
        """Get Supabase client using REST API (works better than direct PostgreSQL)"""
        global _supabase_client
        if _supabase_client is None:
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return _supabase_client
    
    print("✅ Using Supabase REST API (recommended)")

else:
    # Fallback to direct PostgreSQL connection
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL must be set in environment variables")
    
    @contextmanager
    def get_db_connection():
        """Get a database connection using context manager"""
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    class _DBClient:
        """Simple database client mimicking Supabase client interface"""
        
        def table(self, table_name: str):
            return _TableQuery(table_name)

    class _TableQuery:
        def __init__(self, table_name: str):
            self.table_name = table_name
            self._select_cols = "*"
            self._eq_conditions = []
            self._single = False
            self._order_by = None
            self._desc = False
        
        def select(self, columns: str = "*"):
            self._select_cols = columns
            return self
        
        def eq(self, column: str, value):
            self._eq_conditions.append((column, value))
            return self
        
        def order(self, column: str, desc: bool = False):
            self._order_by = column
            self._desc = desc
            return self
        
        def single(self):
            self._single = True
            return self
        
        def insert(self, data):
            self._insert_data = data if isinstance(data, list) else [data]
            return self
        
        def update(self, data):
            self._update_data = data
            return self
        
        def delete(self):
            self._delete = True
            return self
        
        def execute(self):
            """Execute the query and return results"""
            with get_db_connection() as conn:
                cursor = conn.cursor()
                
                # INSERT
                if hasattr(self, '_insert_data'):
                    cols = list(self._insert_data[0].keys())
                    placeholders = ', '.join(['%s'] * len(cols))
                    cols_str = ', '.join(cols)
                    query = f"INSERT INTO {self.table_name} ({cols_str}) VALUES ({placeholders}) RETURNING *"
                    
                    results = []
                    for item in self._insert_data:
                        values = [item[col] for col in cols]
                        cursor.execute(query, values)
                        results.extend(cursor.fetchall())
                    
                    return _QueryResult(results)
                
                # UPDATE
                elif hasattr(self, '_update_data'):
                    set_clause = ', '.join([f"{k} = %s" for k in self._update_data.keys()])
                    where_clause = ' AND '.join([f"{col} = %s" for col, _ in self._eq_conditions])
                    query = f"UPDATE {self.table_name} SET {set_clause}"
                    if where_clause:
                        query += f" WHERE {where_clause}"
                    query += " RETURNING *"
                    
                    values = list(self._update_data.values()) + [val for _, val in self._eq_conditions]
                    cursor.execute(query, values)
                    return _QueryResult(cursor.fetchall())
                
                # DELETE
                elif hasattr(self, '_delete'):
                    where_clause = ' AND '.join([f"{col} = %s" for col, _ in self._eq_conditions])
                    query = f"DELETE FROM {self.table_name}"
                    if where_clause:
                        query += f" WHERE {where_clause}"
                    
                    values = [val for _, val in self._eq_conditions]
                    cursor.execute(query, values)
                    return _QueryResult([])
                
                # SELECT
                else:
                    query = f"SELECT {self._select_cols} FROM {self.table_name}"
                    values = []
                    
                    if self._eq_conditions:
                        where_clause = ' AND '.join([f"{col} = %s" for col, _ in self._eq_conditions])
                        query += f" WHERE {where_clause}"
                        values = [val for _, val in self._eq_conditions]
                    
                    if self._order_by:
                        query += f" ORDER BY {self._order_by}"
                        if self._desc:
                            query += " DESC"
                    
                    cursor.execute(query, values)
                    results = cursor.fetchall()
                    
                    if self._single:
                        return _QueryResult(results[0] if results else None, is_single=True)
                    return _QueryResult(results)

    class _QueryResult:
        def __init__(self, data, is_single=False):
            self.data = data
            self.is_single = is_single

    # Create global client instance
    supabase = _DBClient()

    def get_supabase_client():
        """Get the database client instance"""
        return supabase
    
    print("⚠️ Using direct PostgreSQL connection (may fail with DNS issues)")
