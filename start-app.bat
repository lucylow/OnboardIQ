@echo off
echo 🚀 Starting OnboardIQ Application...

echo.
echo 📦 Starting Backend Server...
cd backend
start "OnboardIQ Backend" cmd /k "npm start"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Starting Frontend Server...
cd ..
start "OnboardIQ Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo 📊 Backend: http://localhost:3001
echo 🎨 Frontend: http://localhost:5173
echo 📋 Dashboard: http://localhost:5173/dashboard
echo.
echo Press any key to exit this window...
pause >nul
