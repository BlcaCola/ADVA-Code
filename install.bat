@echo off
echo Installing Bun...
powershell -c "irm bun.sh/install.ps1 | iex"
echo Bun installed. Installing dependencies...
cd /d "%~dp0"
"%USERPROFILE%\.bun\bin\bun.exe" install
echo Done.
pause