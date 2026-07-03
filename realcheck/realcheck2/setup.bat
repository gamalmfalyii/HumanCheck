@echo off
echo Installing Realcheck dependencies...
npm install
if %errorlevel% neq 0 (
  echo.
  echo Install failed. Make sure Node.js is installed: https://nodejs.org
  pause
  exit /b 1
)
echo.
echo Done! Run "npm start" to launch the app.
pause
