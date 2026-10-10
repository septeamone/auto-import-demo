@echo off
cd /d "%~dp0"
if not exist out call npm run build
start "" "http://localhost:8771/"
python -m http.server 8771 --directory out
