#!/bin/bash

echo "🧹 Cleaning up unused files for production deployment..."

# Remove Firebase files (not using Firebase Hosting)
if [ -f "firebase.json" ]; then
    echo "  ❌ Removing firebase.json"
    rm firebase.json
fi

if [ -f ".firebaserc" ]; then
    echo "  ❌ Removing .firebaserc"
    rm .firebaserc
fi

# Remove old deployment scripts if they exist
if [ -f "deploy-firebase.sh" ]; then
    echo "  ❌ Removing deploy-firebase.sh"
    rm deploy-firebase.sh
fi

# Clean client build artifacts
if [ -d "client/dist" ]; then
    echo "  🗑️  Cleaning client/dist (will rebuild on deploy)"
    rm -rf client/dist
fi

# Clean server build artifacts
if [ -d "server/build" ]; then
    echo "  🗑️  Cleaning server/build (will rebuild on deploy)"
    rm -rf server/build
fi

# Clean logs (keep directory)
if [ -d "logs" ]; then
    echo "  🗑️  Cleaning logs/*"
    rm -f logs/*.log
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📁 Files kept for deployment:"
echo "  ✓ setup-quiz.sh"
echo "  ✓ deploy-backend.sh"
echo "  ✓ deploy-frontend-gcs.sh"
echo "  ✓ DEPLOYMENT-GUIDE.md"
echo "  ✓ server/Dockerfile"
echo "  ✓ client/.env.production"
echo "  ✓ docker-compose.yml (for local dev)"
echo ""
echo "🚀 Ready for deployment!"
