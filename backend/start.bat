@echo off
REM OnboardIQ Backend Startup Script for Windows

echo 🚀 Starting OnboardIQ AI-Powered Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating template...
    (
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=development
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo.
        echo # Vonage Configuration
        echo VONAGE_API_KEY=your-vonage-api-key
        echo VONAGE_API_SECRET=your-vonage-api-secret
        echo.
        echo # Foxit Configuration
        echo FOXIT_API_KEY=your-foxit-api-key
        echo FOXIT_API_BASE_URL=https://api.foxit.com
        echo.
        echo # MuleSoft Configuration
        echo MULESOFT_BASE_URL=https://your-mulesoft-instance.com
        echo MULESOFT_CLIENT_ID=your-mulesoft-client-id
        echo MULESOFT_CLIENT_SECRET=your-mulesoft-client-secret
        echo.
        echo # OpenAI Configuration (for AI-assisted development)
        echo OPENAI_API_KEY=your-openai-api-key
    ) > .env
    echo 📝 Created .env template. Please update with your actual API keys.
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if dependencies are up to date
echo 🔍 Checking dependencies...
npm outdated --depth=0

REM Start the server
echo 🎯 Starting server...
echo 📊 AI Engines will be initialized...
echo 🔗 API will be available at http://localhost:3000
echo 🏥 Health check: http://localhost:3000/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause
