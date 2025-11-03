@echo off
echo ========================================
echo   Azure Voice Agent - Development Mode
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server - http://localhost:8765" cmd /k "cd app\backend && echo. && echo Backend Server Starting... && echo URL: http://localhost:8765 && echo. && python app.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Dev Server...
start "Frontend Server - http://127.0.0.1:5173" cmd /k "cd app\frontend && echo. && echo Frontend Server Starting... && echo. && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8765
echo Frontend: http://127.0.0.1:5173
echo.
echo Check the new windows for server status
echo.
echo To stop servers: Close the command windows
echo.
echo Press any key to close this window...
pause > nul
