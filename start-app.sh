#!/bin/bash

echo "🚀 Starting OnboardIQ Application..."

echo ""
echo "📦 Starting Backend Server..."
cd backend
gnome-terminal --title="OnboardIQ Backend" -- npm start &
# Alternative for different terminals:
# xterm -title "OnboardIQ Backend" -e "npm start" &
# konsole --title "OnboardIQ Backend" -e npm start &

echo ""
echo "⏳ Waiting for backend to start..."
sleep 5

echo ""
echo "🎨 Starting Frontend Server..."
cd ..
gnome-terminal --title="OnboardIQ Frontend" -- npm run dev &
# Alternative for different terminals:
# xterm -title "OnboardIQ Frontend" -e "npm run dev" &
# konsole --title "OnboardIQ Frontend" -e npm run dev &

echo ""
echo "✅ Both servers are starting..."
echo ""
echo "📊 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:5173"
echo "📋 Dashboard: http://localhost:5173/dashboard"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait
