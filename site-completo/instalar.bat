@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title Vortex Tech - Instalacao automatica
cd /d "%~dp0"

echo ==================================================
echo   VORTEX TECH - INSTALACAO AUTOMATICA (Windows)
echo ==================================================
echo.

rem --------------------------------------------------
rem 1. Node.js
rem --------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado.
    echo Baixe a versao LTS em https://nodejs.org e rode este arquivo novamente.
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do set "NODEVER=%%v"
echo [OK] Node.js !NODEVER!

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERRO] npm nao encontrado. Reinstale o Node.js.
    pause
    exit /b 1
)

rem --------------------------------------------------
rem 2. PostgreSQL
rem --------------------------------------------------
set "PSQL="
where psql >nul 2>nul
if not errorlevel 1 set "PSQL=psql"

if not defined PSQL if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set "PSQL=C:\Program Files\PostgreSQL\16\bin\psql.exe"

if not defined PSQL (
    for /d %%d in ("C:\Program Files\PostgreSQL\*") do (
        if exist "%%d\bin\psql.exe" set "PSQL=%%d\bin\psql.exe"
    )
)

if not defined PSQL (
    echo [ERRO] PostgreSQL nao encontrado.
    echo Instale o PostgreSQL em https://www.postgresql.org/download/windows/
    echo Guarde a senha do usuario "postgres" definida na instalacao.
    pause
    exit /b 1
)
echo [OK] PostgreSQL encontrado.

sc query postgresql-x64-16 >nul 2>nul
if not errorlevel 1 (
    sc query postgresql-x64-16 | find /i "RUNNING" >nul
    if errorlevel 1 (
        echo [AVISO] O servico do PostgreSQL esta parado. Tentando iniciar...
        net start postgresql-x64-16 >nul 2>nul
    )
)

rem --------------------------------------------------
rem 3. Arquivo .env
rem --------------------------------------------------
if not exist ".env" (
    if not exist ".env.example" (
        echo [ERRO] Arquivo .env.example nao encontrado.
        pause
        exit /b 1
    )
    copy ".env.example" ".env" >nul
    echo [OK] Arquivo .env criado a partir do .env.example.
)

set "DBSENHA="
set "CHAVE="
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    if /i "%%a"=="DB_PASSWORD" set "DBSENHA=%%b"
    if /i "%%a"=="GEMINI_API_KEY" set "CHAVE=%%b"
)

if /i "!DBSENHA!"=="coloque_a_senha_do_postgres_aqui" set "DBSENHA="
if /i "!CHAVE!"=="coloque_sua_chave_aqui" set "CHAVE="

if not defined DBSENHA (
    echo.
    echo Digite a senha do usuario "postgres" do PostgreSQL.
    echo Foi a senha definida quando o PostgreSQL foi instalado.
    set /p "DBSENHA=Senha do postgres: "
    if not defined DBSENHA (
        echo [ERRO] Nenhuma senha informada. Rode o instalador novamente.
        pause
        exit /b 1
    )
    powershell -NoProfile -Command "$l = Get-Content -LiteralPath '.env'; $out = foreach ($x in $l) { if ($x -match '^DB_PASSWORD=') { 'DB_PASSWORD=' + $env:DBSENHA } else { $x } }; if (-not ($l -match '^DB_PASSWORD=')) { $out += 'DB_PASSWORD=' + $env:DBSENHA }; [IO.File]::WriteAllLines((Resolve-Path '.env'), $out, (New-Object System.Text.UTF8Encoding($false)))"
    echo [OK] Senha salva no .env
)

if not defined CHAVE (
    echo.
    echo Cole a chave do Google AI Studio: https://aistudio.google.com/apikey
    echo Se preferir, pressione Enter para pular. O site funciona, mas o chat nao responde.
    set /p "CHAVE=Chave do Gemini: "
    if defined CHAVE (
        powershell -NoProfile -Command "$l = Get-Content -LiteralPath '.env'; $out = foreach ($x in $l) { if ($x -match '^GEMINI_API_KEY=') { 'GEMINI_API_KEY=' + $env:CHAVE } else { $x } }; if (-not ($l -match '^GEMINI_API_KEY=')) { $out += 'GEMINI_API_KEY=' + $env:CHAVE }; [IO.File]::WriteAllLines((Resolve-Path '.env'), $out, (New-Object System.Text.UTF8Encoding($false)))"
        echo [OK] Chave salva no .env
    ) else (
        echo [AVISO] Sem chave: o chatbot vai avisar que nao esta configurado.
    )
)

rem --------------------------------------------------
rem 4. Dependencias do Node
rem --------------------------------------------------
echo.
echo [1/3] Instalando dependencias (npm install)...
call npm install --no-fund --no-audit
if errorlevel 1 (
    echo [ERRO] Falha no npm install. Verifique a internet e tente novamente.
    pause
    exit /b 1
)

rem --------------------------------------------------
rem 5. Banco de dados
rem --------------------------------------------------
echo.
echo [2/3] Criando o banco, as tabelas e os produtos...
call npm run db:setup
if errorlevel 1 (
    echo.
    echo [ERRO] Nao foi possivel preparar o banco de dados.
    echo Confira se a senha do postgres esta correta e se o servico esta rodando.
    echo Para corrigir depois: ajuste DB_PASSWORD no .env e rode "npm run db:setup".
    pause
    exit /b 1
)

rem --------------------------------------------------
rem 6. Subir o site
rem --------------------------------------------------
echo.
echo [3/3] Iniciando o site...
echo.
echo O site vai abrir em http://localhost:3000
echo DEIXE ESTA JANELA ABERTA. Para desligar, aperte Ctrl+C.
echo.
start "" /min powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm start
pause
