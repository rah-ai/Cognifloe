@echo off
echo Starting CogniFloe Locally...

echo Starting Backend...
start cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload"

echo Starting Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo Done! Services are starting in new windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
