#!/bin/bash

# Simple one-command startup for Mid-Day Meal Management System

echo "🍽️  Mid-Day Meal Management System - Simple Startup"
echo "=================================================="

cd "$(dirname "$0")"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "🗄️  Starting database first..."
docker-compose -f docker-compose.simple.yml up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 15

echo "🔍 Checking database health..."
for i in {1..10}; do
    if docker-compose -f docker-compose.simple.yml exec postgres pg_isready -U middaymeal_user -d middaymeal_db &> /dev/null; then
        echo "✅ Database is ready!"
        break
    fi
    echo "⏳ Database not ready yet... waiting (attempt $i/10)"
    sleep 5
done

echo "🚀 Starting application..."
docker-compose -f docker-compose.simple.yml up --build

echo ""
echo "🌐 Once ready, access at:"
echo "   • Frontend: http://localhost"
echo "   • Backend API: http://localhost:8080/api"
echo "   • Login: admin / admin123"