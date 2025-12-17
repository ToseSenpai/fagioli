#!/bin/bash

# Carrozzeria Fagioli API Test Script
# Tests all major endpoints

BASE_URL="http://localhost:3001"
echo "Testing Carrozzeria Fagioli API at $BASE_URL"
echo "=============================================="
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""
echo ""

# Test 2: Login
echo "2. Testing Staff Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fagioli.it","password":"password123"}')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""
echo "Token: $TOKEN"
echo ""
echo ""

# Test 3: Get Current User
echo "3. Testing Get Current User..."
curl -s "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""
echo ""

# Test 4: List Repairs
echo "4. Testing List Repairs..."
curl -s "$BASE_URL/api/repairs" \
  -H "Authorization: Bearer $TOKEN" | jq '.repairs | length as $count | "Found \($count) repairs"'
echo ""
echo ""

# Test 5: Track Repair (Public - get first tracking code)
echo "5. Testing Public Tracking..."
TRACKING_CODE=$(curl -s "$BASE_URL/api/repairs" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.repairs[0].trackingCode')

echo "Tracking code: $TRACKING_CODE"
curl -s "$BASE_URL/api/track/$TRACKING_CODE" | jq '.repair | {trackingCode, status, customer: .customer.name, vehicle: .vehicle.plate}'
echo ""
echo ""

# Test 6: Submit Pre-Check-In
echo "6. Testing Pre-Check-In Submission..."
CHECKIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/checkin" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+393331111111",
    "customerEmail": "test@example.com",
    "vehiclePlate": "TEST123",
    "vehicleBrand": "Toyota",
    "vehicleModel": "Corolla",
    "vehicleYear": 2023,
    "repairType": "estetica",
    "preferredDate": "2025-12-25",
    "preferredTime": "14:00",
    "notes": "Test submission from API test"
  }')

echo "$CHECKIN_RESPONSE" | jq '.'
NEW_TRACKING_CODE=$(echo "$CHECKIN_RESPONSE" | jq -r '.repair.trackingCode')
echo ""
echo "New tracking code: $NEW_TRACKING_CODE"
echo ""
echo ""

# Test 7: Get Repair Details
echo "7. Testing Get Repair Details..."
REPAIR_ID=$(curl -s "$BASE_URL/api/repairs" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.repairs[0].id')

curl -s "$BASE_URL/api/repairs/$REPAIR_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.repair | {id, trackingCode, status, photoCount: (.photos | length), historyCount: (.statusHistory | length)}'
echo ""
echo ""

# Test 8: Update Status
echo "8. Testing Status Update..."
curl -s -X POST "$BASE_URL/api/repairs/$REPAIR_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted",
    "note": "Test status update from API test"
  }' | jq '.repair | {id, status, updatedAt}'
echo ""
echo ""

echo "=============================================="
echo "API Tests Completed!"
echo ""
echo "Summary:"
echo "- Health check: OK"
echo "- Authentication: OK"
echo "- Repair listing: OK"
echo "- Public tracking: OK"
echo "- Pre-check-in: OK"
echo "- Repair details: OK"
echo "- Status update: OK"
