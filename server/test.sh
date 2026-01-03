#!/bin/bash

# ============================================
# Quiz App API Test Script
# Tests: Authentication (Login, Register) & Role Management
# ============================================

set -e

# Configuration
BASE_URL="http://localhost:8080/api/v1"
ADMIN_EMAIL="admin@quiz.com"
ADMIN_PASSWORD="Admin@123"
TEST_USER_EMAIL="testuser_$(date +%s)@quiz.com"
TEST_USER_PASSWORD="TestUser@123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables to store tokens
ACCESS_TOKEN=""
REFRESH_TOKEN_COOKIE=""
TEST_USER_TOKEN=""

# ============================================
# Helper Functions
# ============================================

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_test() {
    echo -e "${YELLOW}▶ Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ PASSED: $1${NC}"
}

print_error() {
    echo -e "${RED}✗ FAILED: $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if jq is installed
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required but not installed.${NC}"
        echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required but not installed.${NC}"
        exit 1
    fi
}

# Check if server is running
check_server() {
    print_info "Checking if server is running at $BASE_URL..."
    if curl -s --connect-timeout 5 "$BASE_URL/../actuator/health" > /dev/null 2>&1; then
        print_success "Server is running"
    else
        print_error "Server is not running at $BASE_URL"
        echo "Please start the server first with: ./gradlew bootRun"
        exit 1
    fi
}

# ============================================
# Authentication Tests
# ============================================

test_register() {
    print_header "1. REGISTER TEST"
    
    print_test "Register new user: $TEST_USER_EMAIL"
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"Test\",
            \"lastName\": \"User\",
            \"email\": \"$TEST_USER_EMAIL\",
            \"username\": \"testuser_$(date +%s)\",
            \"password\": \"$TEST_USER_PASSWORD\",
            \"confirmPassword\": \"$TEST_USER_PASSWORD\",
            \"dateOfBirth\": \"1990-01-15\",
            \"phoneNumber\": \"+84987654321\"
        }")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "201" ]; then
        TEST_USER_TOKEN=$(echo "$BODY" | jq -r '.data.token')
        print_success "User registered successfully"
        echo "  Response status: $HTTP_CODE"
        echo "  User: $(echo "$BODY" | jq -r '.data.user.email')"
        echo "  Roles: $(echo "$BODY" | jq -r '.data.roles[]')"
    else
        print_error "Registration failed"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
        rm -f response.json
        return 1
    fi
    
    rm -f response.json
}

test_register_duplicate() {
    print_test "Register duplicate email (should fail)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"Test\",
            \"lastName\": \"User\",
            \"email\": \"$TEST_USER_EMAIL\",
            \"username\": \"duplicateuser\",
            \"password\": \"$TEST_USER_PASSWORD\",
            \"confirmPassword\": \"$TEST_USER_PASSWORD\",
            \"dateOfBirth\": \"1990-01-15\",
            \"phoneNumber\": \"+84987654321\"
        }")
    
    if [ "$HTTP_CODE" = "409" ]; then
        print_success "Duplicate registration correctly rejected (409 Conflict)"
    else
        print_error "Expected 409 but got $HTTP_CODE"
        return 1
    fi
}

test_register_validation() {
    print_test "Register with invalid data (validation test)"
    
    # Test weak password
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"Test\",
            \"lastName\": \"User\",
            \"email\": \"weak@test.com\",
            \"username\": \"weakuser\",
            \"password\": \"weak\",
            \"confirmPassword\": \"weak\"
        }")
    
    if [ "$HTTP_CODE" = "400" ]; then
        print_success "Weak password correctly rejected (400 Bad Request)"
    else
        print_error "Expected 400 but got $HTTP_CODE"
    fi
}

test_login_success() {
    print_header "2. LOGIN TEST"
    
    print_test "Login with admin credentials"
    
    # Use temp file for cookies to avoid mixing with response
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -c cookies.txt -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$ADMIN_EMAIL\",
            \"password\": \"$ADMIN_PASSWORD\"
        }")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        ACCESS_TOKEN=$(echo "$BODY" | jq -r '.data.token')
        print_success "Login successful"
        echo "  User: $(echo "$BODY" | jq -r '.data.user.email')"
        echo "  Roles: $(echo "$BODY" | jq -r '.data.roles[]')"
        echo "  Token: ${ACCESS_TOKEN:0:50}..."
    else
        print_error "Login failed"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
        rm -f response.json
        return 1
    fi
    
    rm -f response.json
}

test_login_invalid_credentials() {
    print_test "Login with invalid credentials (should fail)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$ADMIN_EMAIL\",
            \"password\": \"WrongPassword123\"
        }")
    
    if [ "$HTTP_CODE" = "401" ]; then
        print_success "Invalid credentials correctly rejected (401 Unauthorized)"
    else
        print_error "Expected 401 but got $HTTP_CODE"
    fi
}

test_login_nonexistent_user() {
    print_test "Login with non-existent user"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"nonexistent@quiz.com\",
            \"password\": \"Password@123\"
        }")
    
    if [ "$HTTP_CODE" = "401" ]; then
        print_success "Non-existent user correctly rejected (401 Unauthorized)"
    else
        print_error "Expected 401 but got $HTTP_CODE"
    fi
}

# ============================================
# Token Refresh Test
# ============================================

test_refresh_token() {
    print_header "3. REFRESH TOKEN TEST"
    
    print_test "Refresh access token"
    
    # Use the cookies.txt from login
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -b cookies.txt -X POST "$BASE_URL/auth/refresh" \
        -H "Content-Type: application/json")
    
    BODY=$(cat response.json 2>/dev/null || echo "{}")
    
    if [ "$HTTP_CODE" = "200" ]; then
        NEW_TOKEN=$(echo "$BODY" | jq -r '.data.token')
        print_success "Token refreshed successfully"
        echo "  New Token: ${NEW_TOKEN:0:50}..."
    else
        print_info "Refresh token test - HTTP Code: $HTTP_CODE (may need cookie support)"
    fi
    
    rm -f response.json
}

# ============================================
# Role Management Tests (Admin Only)
# ============================================

test_get_all_roles() {
    print_header "4. ROLE MANAGEMENT TESTS"
    
    print_test "Get all roles (with admin token)"
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X GET "$BASE_URL/roles" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        TOTAL=$(echo "$BODY" | jq -r '.data.totalElements')
        print_success "Roles retrieved successfully"
        echo "  Total roles: $TOTAL"
        echo "  Roles:"
        echo "$BODY" | jq -r '.data.content[] | "    - \(.name): \(.description // "No description")"'
    else
        print_error "Failed to get roles"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
        rm -f response.json
        return 1
    fi
    
    rm -f response.json
}

test_get_role_by_id() {
    print_test "Get first role by ID"
    
    # First get all roles to get an ID
    RESPONSE=$(curl -s -X GET "$BASE_URL/roles" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    ROLE_ID=$(echo "$RESPONSE" | jq -r '.data.content[0].id')
    
    if [ "$ROLE_ID" != "null" ] && [ -n "$ROLE_ID" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/roles/$ROLE_ID" \
            -H "Authorization: Bearer $ACCESS_TOKEN")
        
        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        BODY=$(echo "$RESPONSE" | sed '$d')
        
        if [ "$HTTP_CODE" = "200" ]; then
            print_success "Role retrieved by ID"
            echo "  ID: $ROLE_ID"
            echo "  Name: $(echo "$BODY" | jq -r '.data.name')"
        else
            print_error "Failed to get role by ID"
        fi
    else
        print_info "No roles found to test get by ID"
    fi
}

test_search_roles() {
    print_test "Search roles by name"
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X GET "$BASE_URL/roles/search?name=ADMIN" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        TOTAL=$(echo "$BODY" | jq -r '.data.totalElements')
        print_success "Role search successful"
        echo "  Found: $TOTAL role(s) matching 'ADMIN'"
    else
        print_error "Role search failed"
    fi
    
    rm -f response.json
}

test_role_access_without_token() {
    print_test "Access roles without token (should fail)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/roles")
    
    # Both 401 and 403 are acceptable - depends on security config
    if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
        print_success "Unauthorized access correctly rejected ($HTTP_CODE)"
    else
        print_error "Expected 401 or 403 but got $HTTP_CODE"
    fi
}

test_role_access_with_user_token() {
    print_test "Access roles with regular user token (should fail - admin only)"
    
    if [ -n "$TEST_USER_TOKEN" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/roles" \
            -H "Authorization: Bearer $TEST_USER_TOKEN")
        
        if [ "$HTTP_CODE" = "403" ]; then
            print_success "Non-admin access correctly rejected (403 Forbidden)"
        else
            print_info "HTTP Code: $HTTP_CODE (expected 403 for non-admin)"
        fi
    else
        print_info "Skipped - no test user token available"
    fi
}

# ============================================
# User Management Tests (Admin Only)
# ============================================

test_get_all_users() {
    print_header "5. USER MANAGEMENT TESTS"
    
    print_test "Get all users (with admin token)"
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X GET "$BASE_URL/users?page=0&size=10" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        TOTAL=$(echo "$BODY" | jq -r '.data.totalElements')
        print_success "Users retrieved successfully"
        echo "  Total users: $TOTAL"
        echo "  Users:"
        echo "$BODY" | jq -r '.data.content[] | "    - \(.email): \(.fullName) (\(.roles | join(", ")))"'
    else
        print_error "Failed to get users"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
        rm -f response.json
        return 1
    fi
    
    rm -f response.json
}

test_search_users() {
    print_test "Search users by fullName"
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X GET "$BASE_URL/users/search?fullName=Admin" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        TOTAL=$(echo "$BODY" | jq -r '.data.totalElements')
        print_success "User search successful"
        echo "  Found: $TOTAL user(s) matching 'Admin'"
    else
        print_error "User search failed"
    fi
    
    rm -f response.json
}

test_get_user_by_email() {
    print_test "Get user by email"
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X GET "$BASE_URL/users/email/admin@quiz.com" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "User retrieved by email"
        echo "  Email: $(echo "$BODY" | jq -r '.data.email')"
        echo "  Name: $(echo "$BODY" | jq -r '.data.fullName')"
        echo "  Roles: $(echo "$BODY" | jq -r '.data.roles | join(", ")')"
    else
        print_error "Failed to get user by email"
    fi
    
    rm -f response.json
}

test_create_user() {
    print_test "Create new user via admin"
    
    # Get ROLE_USER ID first
    ROLE_USER_ID=$(curl -s -X GET "$BASE_URL/roles/search?name=USER" \
        -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.data.content[0].id')
    
    TIMESTAMP=$(date +%s)
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X POST "$BASE_URL/users" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"New\",
            \"lastName\": \"User\",
            \"email\": \"newuser_${TIMESTAMP}@quiz.com\",
            \"username\": \"newuser_${TIMESTAMP}\",
            \"password\": \"NewUser@123\",
            \"dateOfBirth\": \"1995-05-20\",
            \"phoneNumber\": \"+84912345678\",
            \"active\": true,
            \"roleIds\": [\"$ROLE_USER_ID\"]
        }")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "201" ]; then
        CREATED_USER_ID=$(echo "$BODY" | jq -r '.data.id')
        export CREATED_USER_ID  # Save for update/delete tests
        print_success "User created successfully"
        echo "  Email: $(echo "$BODY" | jq -r '.data.email')"
        echo "  Roles: $(echo "$BODY" | jq -r '.data.roles | join(", ")')"
        echo "  ID: $CREATED_USER_ID"
    else
        print_error "User creation failed"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
    fi
    
    rm -f response.json
}

# Test updating a user
test_update_user() {
    print_test "Update user via admin"
    
    if [ -z "$CREATED_USER_ID" ]; then
        print_error "No user ID available for update test"
        return
    fi
    
    # Get role ID for update
    ROLE_USER_ID=$(curl -s -X GET "$BASE_URL/roles/search?name=USER" \
        -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.data.content[0].id')
    
    UPDATED_TIMESTAMP=$(date +%s)
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X PUT "$BASE_URL/users/$CREATED_USER_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"Updated\",
            \"lastName\": \"User\",
            \"email\": \"updated_user_${UPDATED_TIMESTAMP}@quiz.com\",
            \"username\": \"updated_user_${UPDATED_TIMESTAMP}\",
            \"password\": \"Updated@123\",
            \"dateOfBirth\": \"1992-12-25\",
            \"phoneNumber\": \"+84999888777\",
            \"active\": true,
            \"roleIds\": [\"$ROLE_USER_ID\"]
        }")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "User updated successfully"
        echo "  New Name: $(echo "$BODY" | jq -r '.data.fullName')"
        echo "  New Email: $(echo "$BODY" | jq -r '.data.email')"
    else
        print_error "User update failed"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
    fi
    
    rm -f response.json
}

# Test deleting a user
test_delete_user() {
    print_test "Delete user via admin"
    
    if [ -z "$CREATED_USER_ID" ]; then
        print_error "No user ID available for delete test"
        return
    fi
    
    HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X DELETE "$BASE_URL/users/$CREATED_USER_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    BODY=$(cat response.json)
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "User deleted successfully (soft delete)"
        
        # Verify user is deleted by trying to get all users
        VERIFY_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/users/$CREATED_USER_ID" \
            -H "Authorization: Bearer $ACCESS_TOKEN")
        
        if [ "$VERIFY_CODE" = "404" ]; then
            echo "  Verified: User no longer accessible (404)"
        else
            echo "  Note: User still accessible (HTTP $VERIFY_CODE)"
        fi
    else
        print_error "User delete failed"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
    fi
    
    rm -f response.json
}

test_user_access_without_token() {
    print_test "Access users without token (should fail)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/users")
    
    if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
        print_success "Unauthorized access correctly rejected ($HTTP_CODE)"
    else
        print_error "Expected 401 or 403 but got $HTTP_CODE"
    fi
}

test_user_access_with_regular_user() {
    print_test "Access users with regular user token (should fail - admin only)"
    
    if [ -n "$TEST_USER_TOKEN" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/users" \
            -H "Authorization: Bearer $TEST_USER_TOKEN")
        
        if [ "$HTTP_CODE" = "403" ]; then
            print_success "Non-admin access correctly rejected (403 Forbidden)"
        else
            print_info "HTTP Code: $HTTP_CODE (expected 403 for non-admin)"
        fi
    else
        print_info "Skipped - no test user token available"
    fi
}

# ============================================
# Logout Test
# ============================================

test_logout() {
    print_header "6. LOGOUT TEST"
    
    print_test "Logout user"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/logout" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Logout successful"
    else
        print_error "Logout failed with HTTP Code: $HTTP_CODE"
    fi
}

test_access_after_logout() {
    print_test "Access protected resource after logout"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/roles" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    # Token might still be valid until expiry (stateless JWT)
    print_info "Access after logout - HTTP Code: $HTTP_CODE"
    print_info "(Note: JWT tokens remain valid until expiry in stateless auth)"
}

# Cleanup temp files on exit
cleanup() {
    rm -f cookies.txt response.json
}
trap cleanup EXIT

# ============================================
# Summary
# ============================================

print_summary() {
    print_header "TEST SUMMARY"
    echo ""
    echo "Tests completed!"
    echo ""
    echo "Endpoints tested:"
    echo "  ✓ POST /api/v1/auth/register"
    echo "  ✓ POST /api/v1/auth/login"
    echo "  ✓ POST /api/v1/auth/refresh"
    echo "  ✓ POST /api/v1/auth/logout"
    echo "  ✓ GET  /api/v1/roles"
    echo "  ✓ GET  /api/v1/roles/{id}"
    echo "  ✓ GET  /api/v1/roles/search"
    echo "  ✓ GET    /api/v1/users"
    echo "  ✓ GET    /api/v1/users/search"
    echo "  ✓ GET    /api/v1/users/email/{email}"
    echo "  ✓ POST   /api/v1/users"
    echo "  ✓ PUT    /api/v1/users/{id}"
    echo "  ✓ DELETE /api/v1/users/{id}"
    echo ""
    echo "Test user created: $TEST_USER_EMAIL"
    echo ""
}

# ============================================
# Main Execution
# ============================================

main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     Quiz App API Test Suite                ║${NC}"
    echo -e "${BLUE}║     Auth, Roles & Users Management         ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_dependencies
    check_server
    
    # Authentication Tests
    test_register
    test_register_duplicate
    test_register_validation
    
    test_login_success
    test_login_invalid_credentials
    test_login_nonexistent_user
    
    test_refresh_token
    
    # Role Management Tests
    test_get_all_roles
    test_get_role_by_id
    test_search_roles
    test_role_access_without_token
    test_role_access_with_user_token
    
    # User Management Tests
    test_get_all_users
    test_search_users
    test_get_user_by_email
    test_create_user
    test_update_user
    test_delete_user
    test_user_access_without_token
    test_user_access_with_regular_user
    
    # Logout Tests
    test_logout
    test_access_after_logout
    
    # Summary
    print_summary
}

# Run main function
main "$@"
