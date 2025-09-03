#!/bin/bash

# OnboardIQ Deployment Script
# This script helps deploy the OnboardIQ application

set -e

echo "🚀 OnboardIQ Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the OnboardIQ project root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo ""
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create database directory if it doesn't exist
mkdir -p src/database

echo "✅ Backend setup complete"

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Build frontend for production
echo "Building frontend for production..."
npm run build

# Copy built files to backend static directory
echo "Copying built files to backend..."
rm -rf ../backend/src/static/*
cp -r dist/* ../backend/src/static/

echo "✅ Frontend setup complete"

# Go back to project root
cd ..

echo ""
echo "🎯 Deployment Options:"
echo "1. Local Development:"
echo "   cd backend && source venv/bin/activate && python src/main.py"
echo ""
echo "2. Production Deployment:"
echo "   - Set environment variables in backend/.env"
echo "   - Use a production WSGI server like Gunicorn"
echo "   - Configure reverse proxy (nginx)"
echo ""
echo "3. Cloud Deployment:"
echo "   - Google Cloud Run: gcloud run deploy"
echo "   - AWS Elastic Beanstalk: eb deploy"
echo "   - Azure App Service: az webapp up"
echo ""

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example backend/.env
    echo "⚠️  Please update backend/.env with your API keys and configuration"
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "🔑 Next Steps:"
echo "1. Update backend/.env with your API keys"
echo "2. Test locally: cd backend && source venv/bin/activate && python src/main.py"
echo "3. Deploy to your preferred cloud platform"
echo ""
echo "📚 For detailed instructions, see README.md"

