# OnboardIQ Deployment Guide

This guide provides comprehensive instructions for deploying OnboardIQ in various environments.

## Quick Start

### Local Development

1. **Clone and Setup**
   ```bash
   cd OnboardIQ
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Configure Environment**
   ```bash
   cp .env.example backend/.env
   # Edit backend/.env with your API keys
   ```

3. **Run Application**
   ```bash
   cd backend
   source venv/bin/activate
   python src/main.py
   ```

4. **Access Application**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api

## Production Deployment

### Option 1: Docker Compose (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Domain name configured (optional)

2. **Setup**
   ```bash
   # Configure environment
   cp .env.example backend/.env
   # Edit backend/.env with production values
   
   # Build and start services
   docker-compose up -d
   ```

3. **Services**
   - Application: http://localhost
   - Database: PostgreSQL on port 5432
   - Cache: Redis on port 6379

### Option 2: Cloud Platform Deployment

#### Google Cloud Run

1. **Build and Deploy**
   ```bash
   # Build frontend
   cd frontend && npm run build
   cp -r dist/* ../backend/src/static/
   
   # Deploy to Cloud Run
   cd ../backend
   gcloud run deploy onboardiq \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **Environment Variables**
   Set via Google Cloud Console or CLI:
   ```bash
   gcloud run services update onboardiq \
     --set-env-vars VONAGE_API_KEY=your_key,FOXIT_API_KEY=your_key
   ```

#### AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize and Deploy**
   ```bash
   cd backend
   eb init onboardiq
   eb create production
   eb deploy
   ```

3. **Configure Environment**
   Use AWS Console to set environment variables.

#### Azure App Service

1. **Deploy**
   ```bash
   cd backend
   az webapp up --name onboardiq --resource-group myResourceGroup
   ```

2. **Configure**
   Set environment variables via Azure Portal.

### Option 3: Traditional Server

1. **Server Setup**
   ```bash
   # Install dependencies
   sudo apt update
   sudo apt install python3 python3-pip nginx postgresql redis-server
   
   # Setup application
   git clone <repository>
   cd OnboardIQ
   ./deploy.sh
   ```

2. **Configure Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/onboardiq
   sudo ln -s /etc/nginx/sites-available/onboardiq /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

3. **Setup Systemd Service**
   ```bash
   sudo cp onboardiq.service /etc/systemd/system/
   sudo systemctl enable onboardiq
   sudo systemctl start onboardiq
   ```

## Environment Configuration

### Required Environment Variables

```bash
# Vonage API Configuration
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_VIDEO_API_KEY=your_vonage_video_api_key

# Foxit API Configuration
FOXIT_API_KEY=your_foxit_api_key

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/onboardiq

# Application Configuration
SECRET_KEY=your_secret_key_here
FLASK_ENV=production
```

### Optional Environment Variables

```bash
# SMTP Configuration (alternative to SendGrid)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# File Storage
UPLOAD_FOLDER=/app/uploads
DOCUMENT_FOLDER=/app/documents
```

## API Integration Setup

### Vonage APIs

1. **Create Account**: https://dashboard.nexmo.com/sign-up
2. **Get API Keys**: Dashboard → Settings → API Settings
3. **Enable Services**:
   - Verify API
   - SMS API
   - Video API
   - Network API (for SIM Swap detection)

### Foxit APIs

1. **Create Account**: https://developer-api.foxit.com/
2. **Get API Key**: Developer Console → API Keys
3. **Enable Services**:
   - Document Generation API
   - PDF Services API

### SendGrid (Email)

1. **Create Account**: https://sendgrid.com/
2. **Get API Key**: Settings → API Keys
3. **Verify Domain**: Settings → Sender Authentication

## Database Setup

### PostgreSQL (Production)

```sql
-- Create database and user
CREATE DATABASE onboardiq;
CREATE USER onboardiq_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE onboardiq TO onboardiq_user;
```

### SQLite (Development)

Database file is automatically created at `backend/src/database/app.db`.

## Security Considerations

### SSL/TLS Configuration

1. **Obtain SSL Certificate**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d yourdomain.com
   ```

2. **Update Nginx Configuration**
   Uncomment HTTPS server block in `nginx.conf`.

### API Security

- Use strong API keys
- Enable rate limiting (configured in nginx.conf)
- Implement CORS properly
- Use HTTPS in production
- Regularly rotate secrets

### Database Security

- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups

## Monitoring and Logging

### Application Logs

```bash
# View application logs
docker-compose logs -f backend

# Or for traditional deployment
tail -f /var/log/onboardiq/app.log
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Health Checks

- Application: `GET /api/auth/status`
- Database: Check connection in admin dashboard
- External APIs: Monitor API response times

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use nginx or cloud load balancer
2. **Multiple Instances**: Deploy multiple backend instances
3. **Database**: Use read replicas for better performance
4. **Cache**: Implement Redis for session storage and caching

### Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Caching**: Implement Redis caching for API responses
3. **CDN**: Use CDN for static assets
4. **Compression**: Enable gzip compression (configured in nginx)

## Backup and Recovery

### Database Backup

```bash
# PostgreSQL backup
pg_dump -h localhost -U onboardiq_user onboardiq > backup.sql

# Restore
psql -h localhost -U onboardiq_user onboardiq < backup.sql
```

### File Backup

```bash
# Backup uploaded documents
tar -czf documents_backup.tar.gz /app/documents/
```

## Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Verify keys are correctly set in environment
   - Check API service status
   - Ensure sufficient API credits

2. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify database server is running
   - Check network connectivity

3. **Frontend Not Loading**
   - Ensure frontend is built and copied to static folder
   - Check nginx configuration
   - Verify static file serving

### Debug Mode

```bash
# Enable debug mode (development only)
export FLASK_ENV=development
export FLASK_DEBUG=1
```

### Log Analysis

```bash
# Search for errors
grep -i error /var/log/nginx/error.log
grep -i error /var/log/onboardiq/app.log

# Monitor real-time logs
tail -f /var/log/nginx/access.log | grep -v "GET /health"
```

## Support

For deployment issues:
1. Check logs for error messages
2. Verify environment configuration
3. Test API endpoints individually
4. Review security group/firewall settings
5. Contact support with specific error messages

## Updates and Maintenance

### Application Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Dependency Updates

```bash
# Backend dependencies
cd backend
pip install -r requirements.txt --upgrade

# Frontend dependencies
cd frontend
npm update
```

### Security Updates

- Regularly update base Docker images
- Keep dependencies up to date
- Monitor security advisories
- Rotate API keys periodically

