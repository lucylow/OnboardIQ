#!/bin/bash

# OnboardIQ Backend Startup Script

echo "🚀 Starting OnboardIQ AI-Powered Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
# Server Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Vonage Configuration
VONAGE_API_KEY=your-vonage-api-key
VONAGE_API_SECRET=your-vonage-api-secret

# Foxit Configuration
FOXIT_API_KEY=your-foxit-api-key
FOXIT_API_BASE_URL=https://api.foxit.com

# MuleSoft Configuration
MULESOFT_BASE_URL=https://your-mulesoft-instance.com
MULESOFT_CLIENT_ID=your-mulesoft-client-id
MULESOFT_CLIENT_SECRET=your-mulesoft-client-secret

# OpenAI Configuration (for AI-assisted development)
OPENAI_API_KEY=your-openai-api-key
EOF
    echo "📝 Created .env template. Please update with your actual API keys."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if dependencies are up to date
echo "🔍 Checking dependencies..."
npm outdated --depth=0

# Start the server
echo "🎯 Starting server..."
echo "📊 AI Engines will be initialized..."
echo "🔗 API will be available at http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
