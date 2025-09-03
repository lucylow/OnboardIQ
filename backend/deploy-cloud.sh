#!/bin/bash

# OnboardIQ Cloud Deployment Script
# This script deploys the OnboardIQ backend to Google Cloud Platform

set -e

# Configuration
PROJECT_ID="onboardiq-project"
REGION="us-central1"
SERVICE_NAME="onboardiq-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying OnboardIQ to Google Cloud Platform..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com

# Build and push the Docker image
echo "🏗️ Building and pushing Docker image..."
gcloud builds submit --tag $IMAGE_NAME

# Create secrets (if they don't exist)
echo "🔐 Setting up secrets..."
echo "$VONAGE_API_KEY" | gcloud secrets create vonage-api-key --data-file=- --replication-policy="automatic" || true
echo "$VONAGE_API_SECRET" | gcloud secrets create vonage-api-secret --data-file=- --replication-policy="automatic" || true
echo "$FOXIT_CLIENT_ID" | gcloud secrets create foxit-client-id --data-file=- --replication-policy="automatic" || true
echo "$FOXIT_CLIENT_SECRET" | gcloud secrets create foxit-client-secret --data-file=- --replication-policy="automatic" || true
echo "$MONGODB_URI" | gcloud secrets create mongodb-uri --data-file=- --replication-policy="automatic" || true

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0 \
    --set-secrets=VONAGE_API_KEY=vonage-api-key:latest \
    --set-secrets=VONAGE_API_SECRET=vonage-api-secret:latest \
    --set-secrets=FOXIT_CLIENT_ID=foxit-client-id:latest \
    --set-secrets=FOXIT_CLIENT_SECRET=foxit-client-secret:latest \
    --set-secrets=MONGODB_URI=mongodb-uri:latest \
    --set-env-vars=NODE_ENV=production,PORT=8080,VONAGE_BRAND_NAME=OnboardIQ

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo "✅ Deployment complete!"
echo "🌐 Service URL: $SERVICE_URL"
echo "📊 Health check: $SERVICE_URL/health"

# Test the deployment
echo "🧪 Testing deployment..."
curl -f "$SERVICE_URL/health" || echo "⚠️ Health check failed, but deployment may still be successful"

echo "🎉 OnboardIQ is now running on Google Cloud Platform!"
echo "📝 Next steps:"
echo "   - Update your frontend to use the new API URL: $SERVICE_URL"
echo "   - Set up monitoring and alerting in Google Cloud Console"
echo "   - Configure custom domain and SSL certificate"
echo "   - Set up CI/CD pipeline for automated deployments"
