#!/bin/bash

# Reset Database and Reinitialize Data
# This script drops and recreates the PostgreSQL database, then runs Spring Boot to reinitialize data

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_CONTAINER="quiz-postgres"
DB_NAME="quiz_db"
DB_USER="postgres"
DB_PASSWORD="postgres"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🦕 Dino Quiz - Database Reset Script   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Step 1: Check if PostgreSQL container is running
echo -e "${YELLOW}[1/4] Checking PostgreSQL container...${NC}"
if ! docker ps | grep -q "$DB_CONTAINER"; then
    echo -e "${RED}❌ PostgreSQL container '$DB_CONTAINER' is not running${NC}"
    echo -e "${YELLOW}Starting container...${NC}"
    docker start $DB_CONTAINER || {
        echo -e "${RED}❌ Failed to start container. Please check Docker.${NC}"
        exit 1
    }
    sleep 3  # Wait for container to be ready
fi
echo -e "${GREEN}✅ PostgreSQL container is running${NC}"
echo ""

# Step 2: Drop and recreate database
echo -e "${YELLOW}[2/4] Resetting database '$DB_NAME'...${NC}"
docker exec -i $DB_CONTAINER psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;" || {
    echo -e "${RED}❌ Failed to drop database${NC}"
    exit 1
}
echo -e "${GREEN}✅ Database dropped${NC}"

docker exec -i $DB_CONTAINER psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" || {
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
}
echo -e "${GREEN}✅ Database created${NC}"
echo ""

# Step 3: Clean and build project
echo -e "${YELLOW}[3/4] Cleaning and building project...${NC}"
./gradlew clean build -x test || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Project built successfully${NC}"
echo ""

# Step 4: Run Spring Boot to initialize data
echo -e "${YELLOW}[4/4] Starting Spring Boot to initialize data...${NC}"
echo -e "${BLUE}📝 DataInitializer will create:${NC}"
echo -e "   • Roles: ROLE_USER, ROLE_ADMIN"
echo -e "   • Admin: rex@dinoquiz.academy / Dino@2026"
echo -e "   • User: veloci@dinoquiz.academy / Dino@2026"
echo -e "   • 3 Dino-themed quizzes"
echo ""
echo -e "${GREEN}✅ Database reset complete!${NC}"
echo -e "${BLUE}🚀 Starting backend server...${NC}"
echo ""

# Run bootRun (this will keep running until Ctrl+C)
./gradlew bootRun
