@echo off
chcp 65001 >nul
title Vortex Tech - Servidor
cd /d "%~dp0"

echo ==================================================
echo   Iniciando Vortex Tech...
echo ==================================================
echo.

if not exist "backend\node_modules" (
    echo Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

echo Abrindo o site em: http://localhost:3000
echo Deixe esta janela aberta. Para desligar, aperte Ctrl+C.
echo.

start "" /min powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

cd backend
call npm start
pause
