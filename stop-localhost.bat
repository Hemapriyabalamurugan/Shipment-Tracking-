@echo off
echo Stopping PostgreSQL, Backend, and Frontend...
taskkill /F /IM "postgres.exe" 2>nul
taskkill /F /IM "node.exe" 2>nul
taskkill /F /IM "java.exe" 2>nul
echo All services stopped.
