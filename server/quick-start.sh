#!/bin/bash

# ============================================
# 🦕 Quick Start - Dino Quiz Testing
# ============================================
# One command to reset, start, and test everything

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}║  🦕 DINO QUIZ - QUICK START 🦕           ║${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Reset Database
echo -e "${YELLOW}[1/3] Resetting Database...${NC}"
./reset-database.sh
echo ""

# Step 2: Start Application
echo -e "${YELLOW}[2/3] Starting Application...${NC}"
echo -e "${BLUE}Running: ./gradlew bootRun${NC}"
echo -e "${BLUE}This will take ~30 seconds...${NC}"
echo ""

# Start in background
./gradlew bootRun > /dev/null 2>&1 &
APP_PID=$!

# Wait for application to be ready
echo -e "${BLUE}Waiting for application to start...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Application is ready!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}✗ Application failed to start within 60 seconds${NC}"
        kill $APP_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# Step 3: Run Tests
echo -e "${YELLOW}[3/3] Running API Tests...${NC}"
./test-all-apis.sh

# Cleanup
echo ""
echo -e "${YELLOW}Stopping application...${NC}"
kill $APP_PID 2>/dev/null || true
echo -e "${GREEN}✓ Done!${NC}"
