import os

class Settings:
    PROJECT_NAME: str = "CogniFloe"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cognifloe.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_change_me_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
