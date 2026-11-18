@echo off
chcp 65001 >nul
title Vortex Tech - Instalador e Configurador
cd /d "%~dp0"

echo ==================================================
echo   VORTEX TECH - INSTALACAO E CONFIGURACAO
echo ==================================================
echo.

rem --------------------------------------------------
rem 1. Verificar Node.js
rem --------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Node.js nao foi encontrado no sistema.
    echo Baixe a versao recomendada LTS em https://nodejs.org e tente novamente.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado!

rem --------------------------------------------------
rem 2. Verificar PostgreSQL
rem --------------------------------------------------
where psql >nul 2>nul
if not errorlevel 1 (
    echo [OK] PostgreSQL encontrado no sistema.
) else (
    echo [AVISO] PostgreSQL nao esta no PATH do sistema.
    echo O site funcionara normalmente com catalogo em memoria.
)

rem --------------------------------------------------
rem 3. Configurar arquivo .env
rem --------------------------------------------------
echo.
echo [1/3] Verificando configuracoes .env...

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [OK] Arquivo .env criado a partir do .env.example.
    )
)

rem --------------------------------------------------
rem 4. Instalar dependencias do backend
rem --------------------------------------------------
echo.
echo [2/3] Instalando dependencias do Node.js express e pg...
cd backend
call npm install --no-fund --no-audit
if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao instalar dependencias. Verifique sua internet.
    cd ..
    pause
    exit /b 1
)

rem --------------------------------------------------
rem 5. Configurar banco de dados
rem --------------------------------------------------
echo.
echo [3/3] Verificando banco de dados PostgreSQL...
call node setup.js
cd ..

echo.
echo ==================================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ==================================================
echo Para abrir o site e o chatbot, de dois cliques em:
echo              ==^> iniciar.bat ^<==
echo.
pause
