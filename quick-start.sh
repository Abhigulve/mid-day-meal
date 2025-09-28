#!/bin/bash

# Quick Start Script - Run in background
set -e

echo "🍽️  Mid-Day Meal Management System - Quick Start"
echo "================================================"

cd "$(dirname "$0")"

# Function to run setup in background
run_setup() {
    echo "🚀 Starting setup in background..."
    nohup ./setup-local.sh > setup.log 2>&1 &
    SETUP_PID=$!
    echo "📝 Setup running with PID: $SETUP_PID"
    echo "📋 Monitor progress with: tail -f setup.log"
    echo "🔍 Check status with: docker-compose ps"
    echo ""
    echo "🌐 Once complete, access at:"
    echo "   • Web App: http://localhost:3000"
    echo "   • API: http://localhost:8080/api"
    echo "   • Full System: http://localhost"
    echo ""
    echo "⏳ Setup typically takes 5-10 minutes on first run..."
}

# Check if already running
if docker-compose ps | grep -q "Up"; then
    echo "✅ System appears to be running already!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   • Web Application: http://localhost:3000"
    echo "   • Backend API: http://localhost:8080/api"
    echo "   • Full System: http://localhost"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
else
    run_setup
fi