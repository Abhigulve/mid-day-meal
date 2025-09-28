#!/bin/bash

# Mid-Day Meal Management System - Stop Local Setup Script

set -e

echo "🛑 Stopping Mid-Day Meal Management System..."
echo "=============================================="

# Navigate to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Stop and remove containers
echo "📦 Stopping containers..."
docker-compose down

echo "✅ All services stopped successfully!"
echo ""
echo "💡 To completely clean up (remove volumes and data):"
echo "   docker-compose down -v --remove-orphans"
echo ""
echo "🔄 To restart the system:"
echo "   ./setup-local.sh"