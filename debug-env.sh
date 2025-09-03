#!/bin/bash

# Debug Environment Variables Script
# This script helps debug environment variable issues in ECS

echo "🔍 Environment Variables Debug Report"
echo "====================================="
echo ""

echo "📋 Node.js Environment:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo ""

echo "🌐 Next.js Public Variables:"
echo "NEXT_PUBLIC_ENVIRONMENT: $NEXT_PUBLIC_ENVIRONMENT"
echo "NEXT_PUBLIC_BASE_URL: $NEXT_PUBLIC_BASE_URL"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
echo "NEXT_PUBLIC_APP_NAME: $NEXT_PUBLIC_APP_NAME"
echo "NEXT_PUBLIC_APP_VERSION: $NEXT_PUBLIC_APP_VERSION"
echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID: $NEXT_PUBLIC_GOOGLE_CLIENT_ID"
echo "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: $NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT"
echo "NEXT_PUBLIC_PAYU_KEY: $NEXT_PUBLIC_PAYU_KEY"
echo ""

echo "🔐 Payload CMS Variables (should be from Secrets Manager):"
if [ -z "$DATABASE_URI" ]; then
    echo "❌ DATABASE_URI: NOT SET"
else
    echo "✅ DATABASE_URI: SET (length: ${#DATABASE_URI})"
fi

if [ -z "$PAYLOAD_SECRET" ]; then
    echo "❌ PAYLOAD_SECRET: NOT SET"
else
    echo "✅ PAYLOAD_SECRET: SET (length: ${#PAYLOAD_SECRET})"
fi

if [ -z "$S3_BUCKET" ]; then
    echo "❌ S3_BUCKET: NOT SET"
else
    echo "✅ S3_BUCKET: $S3_BUCKET"
fi

if [ -z "$S3_ACCESS_KEY_ID" ]; then
    echo "❌ S3_ACCESS_KEY_ID: NOT SET"
else
    echo "✅ S3_ACCESS_KEY_ID: SET (length: ${#S3_ACCESS_KEY_ID})"
fi

if [ -z "$S3_SECRET_ACCESS_KEY" ]; then
    echo "❌ S3_SECRET_ACCESS_KEY: NOT SET"
else
    echo "✅ S3_SECRET_ACCESS_KEY: SET (length: ${#S3_SECRET_ACCESS_KEY})"
fi

if [ -z "$S3_REGION" ]; then
    echo "❌ S3_REGION: NOT SET"
else
    echo "✅ S3_REGION: $S3_REGION"
fi

echo ""
echo "🔍 All Environment Variables:"
echo "============================="
env | grep -E "(NEXT_PUBLIC_|DATABASE_|PAYLOAD_|S3_)" | sort

echo ""
echo "🎯 Testing Payload Configuration:"
echo "================================"
node -e "
try {
  console.log('Database URI available:', !!process.env.DATABASE_URI);
  console.log('Payload Secret available:', !!process.env.PAYLOAD_SECRET);
  console.log('S3 Config available:', !!process.env.S3_BUCKET);
  
  if (process.env.DATABASE_URI) {
    const dbUri = process.env.DATABASE_URI;
    const urlParts = new URL(dbUri);
    console.log('Database Host:', urlParts.hostname);
    console.log('Database Port:', urlParts.port);
    console.log('Database Name:', urlParts.pathname.substring(1));
  }
} catch (error) {
  console.error('Error checking environment:', error.message);
}
"
