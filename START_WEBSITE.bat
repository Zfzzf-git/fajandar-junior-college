@echo off
setlocal EnableDelayedExpansion
title FAJANDAR JUNIOR COLLEGE, VAHOOR - Website Launcher

:: ============================================================================
:: FAJANDAR JUNIOR COLLEGE, VAHOOR
:: One-Click Portable Website Launcher
:: Works from USB Pendrive or Any Windows PC / Laptop
:: No external installation of Node.js or Google Antigravity required.
:: ============================================================================

:: 1. Detect current directory
set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

echo.
echo  ========================================================================
echo    FAJANDAR JUNIOR COLLEGE, VAHOOR - PORTABLE LOCAL LAUNCHER
echo  ========================================================================
echo.
echo  [1/3] Detecting project files...

:: 2. Find website folder containing index.html
set "SITE_DIR="
if exist "%BASE_DIR%index.html" (
    set "SITE_DIR=%BASE_DIR%"
) else if exist "%BASE_DIR%FAJANDAR\index.html" (
    set "SITE_DIR=%BASE_DIR%FAJANDAR\"
)

if "%SITE_DIR%"=="" (
    echo.
    echo  [ERROR] Could not locate 'index.html'!
    echo  Please ensure the website folder contains index.html, style.css, and script.js.
    echo.
    echo  Searched:
    echo    - %BASE_DIR%
    echo    - %BASE_DIR%FAJANDAR\
    echo.
    pause
    exit /b 1
)

:: Remove trailing backslash if present to avoid \" escaping issue
if "%SITE_DIR:~-1%"=="\" set "SITE_DIR=%SITE_DIR:~0,-1%"

:: 3. Find portable_server.ps1
set "PS_SCRIPT="
if exist "%SITE_DIR%portable_server.ps1" (
    set "PS_SCRIPT=%SITE_DIR%portable_server.ps1"
) else if exist "%BASE_DIR%portable_server.ps1" (
    set "PS_SCRIPT=%BASE_DIR%portable_server.ps1"
)

echo  [2/3] Project folder found: %SITE_DIR%
echo  [3/3] Initializing local web server...
echo.

:: 4. Primary Launch Method: Native Windows PowerShell & .NET (Zero-Dependency)
if not "%PS_SCRIPT%"=="" (
    where powershell.exe >nul 2>&1
    if !errorlevel! equ 0 (
        powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" "%SITE_DIR%"
        if !errorlevel! equ 0 goto :End
    )
)

:: 5. Fallback Method A: Python (if installed on target PC)
where python.exe >nul 2>&1
if !errorlevel! equ 0 (
    echo  PowerShell server unavailable. Using Python fallback on port 8080...
    start "" http://localhost:8080/
    python.exe -m http.server 8080 --directory "%SITE_DIR%"
    goto :End
)

:: 6. Fallback Method B: Direct Browser Launch
echo.
echo  [NOTICE] Starting server via direct local browser launch...
start "" "%SITE_DIR%index.html"

:End
echo.
echo  Server session ended.
pause
