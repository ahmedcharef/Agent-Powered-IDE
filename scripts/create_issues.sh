#!/bin/bash

# GitHub Configuration
GITHUB_TOKEN="GITHUB_PERSONAL_ACCESS_TOKEN"
REPO_OWNER="ahmedcharef"
REPO_NAME="Agent-Powered-IDE"
API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues"

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    curl -X POST "$API_URL" \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -d @- << EOF
{
    "title": "$title",
    "body": "$body",
    "labels": $labels
}
EOF
    echo ""
}

echo "Creating GitHub issues for E-Commerce SaaS project..."
echo "=================================================="
echo ""

# Backend Setup Tasks
echo "Creating backend setup tasks..."
