# OnboardIQ Cloud Deployment Guide

This guide covers the complete cloud-native deployment of the OnboardIQ AI-Powered Multi-Channel Customer Onboarding platform.

## 🚀 Cloud Architecture Overview

OnboardIQ leverages cloud-native technologies to deliver a scalable, secure, and high-performance onboarding solution:

### **Multi-Cloud Ready Architecture**
- **Google Cloud Platform** (Primary): Cloud Run, BigQuery, Secret Manager
- **AWS** (Alternative): ECS/Fargate, RDS, Secrets Manager
- **Azure** (Alternative): Container Instances, Cosmos DB, Key Vault

### **Cloud-Native Features**
- **Serverless/Containerized**: Auto-scaling based on demand
- **Event-Driven**: Real-time analytics and notifications
- **API-First**: RESTful APIs with comprehensive documentation
- **Security-First**: Encryption, IAM, and compliance ready

## 🏗️ Infrastructure Components

### **1. Application Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Load Balancer                      │
├─────────────────────────────────────────────────────────────┤
│                    Nginx Reverse Proxy                      │
│              (Rate Limiting, SSL Termination)               │
├─────────────────────────────────────────────────────────────┤
│                    OnboardIQ API Service                    │
│              (Node.js/Express, Auto-scaling)                │
├─────────────────────────────────────────────────────────────┤
│                    Analytics Service                        │
│              (Real-time data processing)                    │
└─────────────────────────────────────────────────────────────┘
```

### **2. Data Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                            │
│              (Managed Database Service)                     │
├─────────────────────────────────────────────────────────────┤
│                    Redis Cache                              │
│              (Session Storage & Caching)                   │
├─────────────────────────────────────────────────────────────┤
│                    Cloud Storage                            │
│              (Document Storage & Backups)                  │
└─────────────────────────────────────────────────────────────┘
```

### **3. Integration Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    Vonage APIs                              │
│              (SMS, Video, Verify)                           │
├─────────────────────────────────────────────────────────────┤
│                    Foxit APIs                               │
│              (Document Generation & Processing)             │
├─────────────────────────────────────────────────────────────┤
│                    Email Service                            │
│              (SendGrid/Nodemailer)                         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Options

### **Option 1: Google Cloud Platform (Recommended)**

#### **Prerequisites**
- Google Cloud SDK installed
- Project with billing enabled
- Required APIs enabled

#### **Quick Deployment**
```bash
# Clone the repository
git clone <repository-url>
cd onboardiq-connect

# Set environment variables
export VONAGE_API_KEY="your_vonage_api_key"
export VONAGE_API_SECRET="your_vonage_api_secret"
export FOXIT_CLIENT_ID="your_foxit_client_id"
export FOXIT_CLIENT_SECRET="your_foxit_client_secret"
export MONGODB_URI="your_mongodb_connection_string"

# Deploy to Google Cloud
cd backend
chmod +x deploy-cloud.sh
./deploy-cloud.sh
```

#### **Manual Deployment Steps**

1. **Enable Required APIs**
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

2. **Create Secrets**
```bash
echo "$VONAGE_API_KEY" | gcloud secrets create vonage-api-key --data-file=-
echo "$VONAGE_API_SECRET" | gcloud secrets create vonage-api-secret --data-file=-
echo "$FOXIT_CLIENT_ID" | gcloud secrets create foxit-client-id --data-file=-
echo "$FOXIT_CLIENT_SECRET" | gcloud secrets create foxit-client-secret --data-file=-
echo "$MONGODB_URI" | gcloud secrets create mongodb-uri --data-file=-
```

3. **Build and Deploy**
```bash
# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/onboardiq-api

# Deploy to Cloud Run
gcloud run deploy onboardiq-api \
    --image gcr.io/PROJECT_ID/onboardiq-api \
    --platform managed \
    --region us-central1 \
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
    --set-env-vars=NODE_ENV=production,PORT=8080
```

### **Option 2: AWS Deployment**

#### **Using AWS ECS/Fargate**

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name onboardiq-api
```

2. **Build and Push Image**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker build -t onboardiq-api .
docker tag onboardiq-api:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/onboardiq-api:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/onboardiq-api:latest
```

3. **Deploy with ECS**
```bash
# Create ECS cluster and service
aws ecs create-cluster --cluster-name onboardiq-cluster
aws ecs create-service --cluster onboardiq-cluster --service-name onboardiq-api --task-definition onboardiq-task
```

### **Option 3: Azure Deployment**

#### **Using Azure Container Instances**

1. **Create Container Registry**
```bash
az acr create --resource-group onboardiq-rg --name onboardiqacr --sku Basic
```

2. **Build and Push Image**
```bash
az acr build --registry onboardiqacr --image onboardiq-api .
```

3. **Deploy Container Instance**
```bash
az container create \
    --resource-group onboardiq-rg \
    --name onboardiq-api \
    --image onboardiqacr.azurecr.io/onboardiq-api:latest \
    --ports 8080 \
    --environment-variables NODE_ENV=production
```

## 🔧 Local Development Setup

### **Using Docker Compose**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f onboardiq-api

# Stop services
docker-compose down
```

### **Environment Variables**

Create a `.env` file in the backend directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Vonage API Configuration
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_BRAND_NAME=OnboardIQ

# Foxit API Configuration
FOXIT_CLIENT_ID=your_foxit_client_id
FOXIT_CLIENT_SECRET=your_foxit_client_secret

# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Database
MONGODB_URI=mongodb://localhost:27017/onboardiq

# Redis (for caching)
REDIS_URL=redis://localhost:6379
```

## 📊 Monitoring & Analytics

### **Cloud Monitoring Setup**

#### **Google Cloud Monitoring**
```bash
# Enable monitoring APIs
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com

# Create monitoring dashboard
gcloud monitoring dashboards create --config=dashboard-config.json
```

#### **Custom Metrics**
The application automatically tracks:
- API response times
- Error rates
- User engagement metrics
- Onboarding funnel conversion rates
- Channel performance metrics

### **Logging Configuration**

#### **Structured Logging**
```javascript
// Example log format
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "onboardiq-api",
  "userId": "user_123",
  "event": "verification_completed",
  "metadata": {
    "channel": "sms",
    "processingTime": 1250,
    "success": true
  }
}
```

## 🔒 Security Configuration

### **Network Security**

#### **Firewall Rules**
```bash
# Allow only necessary ports
gcloud compute firewall-rules create onboardiq-allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server

gcloud compute firewall-rules create onboardiq-allow-https \
    --allow tcp:443 \
    --source-ranges 0.0.0.0/0 \
    --target-tags https-server
```

#### **SSL/TLS Configuration**
```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
}
```

### **Application Security**

#### **Rate Limiting**
```nginx
# Rate limiting configuration
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=signup:10m rate=2r/s;
```

#### **CORS Configuration**
```javascript
// Express CORS configuration
app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📈 Scaling Configuration

### **Auto-Scaling Policies**

#### **Google Cloud Run**
```bash
# Configure auto-scaling
gcloud run services update onboardiq-api \
    --max-instances 50 \
    --min-instances 1 \
    --concurrency 80 \
    --cpu-throttling
```

#### **AWS ECS**
```json
{
  "AutoScalingTargetTrackingScalingPolicyConfiguration": {
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    }
  }
}
```

### **Database Scaling**

#### **MongoDB Atlas**
- Enable auto-scaling for clusters
- Configure read replicas for analytics
- Set up proper indexing strategies

#### **Redis Cluster**
```bash
# Redis cluster configuration
redis-cli --cluster create \
    node1:6379 node2:6379 node3:6379 \
    node4:6379 node5:6379 node6:6379 \
    --cluster-replicas 1
```

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

```yaml
name: Deploy to Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build Docker image
        run: docker build -t onboardiq-api .
        
      - name: Deploy to Google Cloud
        run: |
          echo ${{ secrets.GCP_SA_KEY }} | gcloud auth activate-service-account --key-file=-
          gcloud config set project ${{ secrets.GCP_PROJECT_ID }}
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/onboardiq-api
          gcloud run deploy onboardiq-api --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/onboardiq-api --region us-central1
```

## 🚨 Disaster Recovery

### **Backup Strategy**

#### **Database Backups**
```bash
# MongoDB Atlas automated backups
# Configure daily backups with 30-day retention

# Manual backup script
mongodump --uri="$MONGODB_URI" --out=./backups/$(date +%Y%m%d)
```

#### **Application State**
- Use stateless application design
- Store session data in Redis
- Implement idempotent API operations

### **Recovery Procedures**

1. **Database Recovery**
```bash
# Restore from backup
mongorestore --uri="$MONGODB_URI" ./backups/20240115/
```

2. **Application Recovery**
```bash
# Redeploy application
./deploy-cloud.sh

# Verify health checks
curl -f https://your-api-url/health
```

## 📋 Compliance & Governance

### **Data Protection**

#### **GDPR Compliance**
- Implement data minimization
- Provide data portability
- Enable right to be forgotten
- Maintain audit logs

#### **SOC 2 Compliance**
- Implement access controls
- Monitor system access
- Maintain security logs
- Regular security assessments

### **Audit Logging**

```javascript
// Audit log example
{
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "user_123",
  "action": "data_access",
  "resource": "user_profile",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

## 🎯 Performance Optimization

### **Caching Strategy**

#### **Redis Caching**
```javascript
// Cache frequently accessed data
const cacheKey = `user:${userId}:profile`;
const cachedData = await redis.get(cacheKey);
if (!cachedData) {
  const data = await fetchUserProfile(userId);
  await redis.setex(cacheKey, 3600, JSON.stringify(data));
}
```

#### **CDN Configuration**
```bash
# Configure Cloud CDN for static assets
gcloud compute backend-buckets create onboardiq-static \
    --gcs-bucket-name=onboardiq-static-assets
```

### **Database Optimization**

#### **Indexing Strategy**
```javascript
// MongoDB indexes for performance
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "createdAt": 1 });
db.analytics.createIndex({ "userId": 1, "timestamp": -1 });
```

## 📞 Support & Maintenance

### **Health Monitoring**

#### **Health Check Endpoints**
- `/health` - Basic health check
- `/health/detailed` - Detailed system status
- `/metrics` - Prometheus metrics

#### **Alerting Configuration**
```yaml
# Alerting rules
groups:
  - name: onboardiq-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
```

### **Maintenance Windows**

- Schedule maintenance during low-traffic hours
- Use blue-green deployment for zero-downtime updates
- Implement feature flags for gradual rollouts

---

## 🎉 Next Steps

1. **Deploy to your chosen cloud platform**
2. **Configure monitoring and alerting**
3. **Set up CI/CD pipeline**
4. **Implement security best practices**
5. **Monitor performance and optimize**
6. **Scale based on usage patterns**

For additional support or customization, refer to the project documentation or contact the development team.
