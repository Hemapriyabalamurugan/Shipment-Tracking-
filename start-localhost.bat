@echo off
echo ========================================================
echo  Starting ShipTrackPro Localhost Environment
echo ========================================================

REM Start PostgreSQL
echo [1/3] Starting PostgreSQL...
start "PostgreSQL Server" /B "C:\Users\Acer\.gemini\antigravity\scratch\pgsql\bin\postgres.exe" -D "C:\Users\Acer\.gemini\antigravity\scratch\pgsql\data"
timeout /t 3 /nobreak >nul

REM Start Backend
echo [2/3] Starting Spring Boot Backend (Port 8080)...
cd /d "C:\Users\Acer\.gemini\antigravity\scratch\Shipment-Tracking\backend"
start "ShipTrackPro Backend" cmd /c "mvnw.cmd spring-boot:run"
timeout /t 8 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Vite Frontend (Port 5173)...
cd /d "C:\Users\Acer\.gemini\antigravity\scratch\Shipment-Tracking\frontend"
start "ShipTrackPro Frontend" cmd /c "npm run dev"

echo.
echo ========================================================
echo  All services launched!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8080
echo ========================================================
