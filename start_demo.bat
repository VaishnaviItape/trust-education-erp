@echo off
title Trust Education ERP - Demo Launcher
color 06

echo ======================================================================
echo    SHREE SARASWATI EDUCATION TRUST - ERP & WEB DEMO LAUNCHER
echo    Brand Theme: Vibrant Education Orange (#EA580C)
echo ======================================================================
echo.
echo Starting Backend API Server with Interactive Swagger (Port 5000)...
start "Trust ERP - Backend API" cmd /k "cd /d %~dp0api && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Web Admin Portal & Public Website (Port 3000)...
start "Trust ERP - Web Portal" cmd /k "cd /d %~dp0web && npm run dev"

echo.
echo ======================================================================
echo    All services launched successfully!
echo    - Interactive Swagger API: http://localhost:5000/api-docs
echo    - Web Admin & Website:     http://localhost:3000
echo    - Backend API:             http://localhost:5000
echo.
echo    Opening Swagger UI in your default browser...
start http://localhost:5000/api-docs
echo.
echo    To launch the mobile app demo on your smartphone:
echo    Open a terminal in the 'mobile/' folder and run:
echo    cd mobile && npx expo start
echo ======================================================================
echo.
pause
