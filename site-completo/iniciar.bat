@echo off
chcp 65001 >nul
title Vortex Tech
cd /d "%~dp0"

if not exist "node_modules" (
    echo As dependencias ainda nao foram instaladas.
    echo Rode primeiro o arquivo instalar.bat
    pause
    exit /b 1
)

echo Iniciando Vortex Tech em http://localhost:3000
echo Deixe esta janela aberta. Para desligar, aperte Ctrl+C.
echo.
start "" /min powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm start
pause
