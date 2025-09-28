#!/bin/bash

# Mid-Day Meal Management System - View Logs Script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📋 Mid-Day Meal Management System - Service Logs"
echo "================================================"

if [ $# -eq 0 ]; then
    echo "Available services:"
    echo "  • postgres"
    echo "  • backend"
    echo "  • frontend-web"
    echo "  • nginx"
    echo ""
    echo "Usage:"
    echo "  ./logs.sh [service_name]  - View logs for specific service"
    echo "  ./logs.sh all            - View logs for all services"
    echo ""
    echo "Examples:"
    echo "  ./logs.sh backend"
    echo "  ./logs.sh all"
    echo "  ./logs.sh postgres"
    exit 1
fi

if [ "$1" = "all" ]; then
    echo "📊 Showing logs for all services (Ctrl+C to exit):"
    docker-compose logs -f
else
    echo "📊 Showing logs for $1 service (Ctrl+C to exit):"
    docker-compose logs -f "$1"
fi