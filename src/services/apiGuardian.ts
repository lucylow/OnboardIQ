import axios from 'axios';

// Types for API Health Monitoring
export interface APIEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  expectedStatus?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HealthMetrics {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorRate: number;
  lastCheck: string;
  uptime: number;
  errors: Array<{
    timestamp: string;
    error: string;
    statusCode?: number;
  }>;
}

// API Ecosystem Monitoring Module
export class APIGuardian {
  private monitoredEndpoints: Map<string, HealthMetrics>;
  private alertThresholds: {
    responseTime: number;
    errorRate: number;
    consecutiveFailures: number;
  };

  constructor() {
    this.monitoredEndpoints = new Map();
    this.alertThresholds = {
      responseTime: 2000,
      errorRate: 5,
      consecutiveFailures: 3
    };
  }

  async checkEndpointHealth(endpoint: APIEndpoint): Promise<HealthMetrics> {
    const startTime = Date.now();
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';
    let responseTime = 0;
    let errorRate = 0;

    try {
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        timeout: endpoint.timeout || 5000,
        headers: endpoint.headers || {},
        validateStatus: () => true
      });

      responseTime = Date.now() - startTime;
      
      if (response.status !== endpoint.expectedStatus) {
        status = 'down';
        errorRate = 100;
      } else if (responseTime > this.alertThresholds.responseTime) {
        status = 'degraded';
      }

      const metrics: HealthMetrics = {
        status,
        responseTime,
        errorRate,
        lastCheck: new Date().toISOString(),
        uptime: this.calculateUptime(endpoint.url),
        errors: []
      };

      this.monitoredEndpoints.set(endpoint.url, metrics);

      if (status === 'degraded' || status === 'down') {
        await this.triggerAlert(endpoint, metrics);
      }

      return metrics;

    } catch (error) {
      responseTime = Date.now() - startTime;
      status = 'down';
      errorRate = 100;

      const metrics: HealthMetrics = {
        status,
        responseTime,
        errorRate,
        lastCheck: new Date().toISOString(),
        uptime: this.calculateUptime(endpoint.url),
        errors: []
      };

      this.monitoredEndpoints.set(endpoint.url, metrics);
      await this.triggerAlert(endpoint, metrics);

      return metrics;
    }
  }

  async triggerAlert(endpoint: APIEndpoint, healthData: HealthMetrics) {
    console.log(`ALERT: API ${endpoint.name} is ${healthData.status}`);
    
    // TODO: Integrate with Vonage SMS and Foxit document generation
    const message = `ALERT: API ${endpoint.name} is ${healthData.status}. Response time: ${healthData.responseTime}ms. Errors: ${healthData.errorRate}%`;
    
    // Send alert via Vonage SMS
    // await vonageApi.sendSMS({ to: process.env.ON_CALL_ENGINEER, text: message });
    
    // Generate incident report using Foxit
    // await this.generateIncidentReport(endpoint, healthData);
  }

  private calculateUptime(endpointUrl: string): number {
    const metrics = this.monitoredEndpoints.get(endpointUrl);
    if (!metrics) return 100;
    return Math.round((1 - metrics.errorRate / 100) * 100);
  }

  getHealthMetrics(endpointUrl: string): HealthMetrics | undefined {
    return this.monitoredEndpoints.get(endpointUrl);
  }

  getAllHealthMetrics(): Map<string, HealthMetrics> {
    return new Map(this.monitoredEndpoints);
  }
}

export const apiGuardian = new APIGuardian();
