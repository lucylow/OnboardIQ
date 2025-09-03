import { EventEmitter } from 'events';

interface RealTimeEvent {
  type: string;
  data: unknown;
  timestamp: string;
}

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

class RealTimeService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private isConnecting = false;
  private config: WebSocketConfig;
  private subscriptions: Set<string> = new Set();

  constructor(config: Partial<WebSocketConfig> = {}) {
    super();
    this.config = {
      url: config.url || 'ws://localhost:8084',
      reconnectInterval: config.reconnectInterval || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('connected');
          resolve();

          // Resubscribe to previous subscriptions
          this.subscriptions.forEach(subscription => {
            this.subscribe(subscription);
          });
        };

        this.ws.onmessage = (event) => {
          try {
            const message: RealTimeEvent = JSON.parse(event.data);
            this.emit('message', message);
            this.emit(message.type, message.data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.emit('disconnected', event);

          if (!event.wasClean && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, this.config.reconnectInterval);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.subscriptions.clear();
  }

  subscribe(channel: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.subscriptions.add(channel);
      return;
    }

    const message = {
      type: `subscribe_${channel}`,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(message));
    this.subscriptions.add(channel);
  }

  unsubscribe(channel: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.subscriptions.delete(channel);
      return;
    }

    const message = {
      type: `unsubscribe_${channel}`,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(message));
    this.subscriptions.delete(channel);
  }

  sendMessage(type: string, data: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message = {
      type,
      data,
      timestamp: new Date().toISOString()
    };

    this.ws.send(JSON.stringify(message));
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

// Analytics-specific real-time service
class AnalyticsRealTimeService extends RealTimeService {
           private analyticsData: unknown = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    super({ url: 'ws://localhost:8084' });
    this.setupAnalyticsHandlers();
  }

  private setupAnalyticsHandlers(): void {
    this.on('analytics_update', (data) => {
      this.analyticsData = data;
      this.emit('analytics_updated', data);
    });

    this.on('connected', () => {
      this.subscribe('analytics');
    });
  }

  startRealTimeUpdates(interval: number = 5000): void {
    this.stopRealTimeUpdates();
    
    this.updateInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/analytics/real-time');
        const data = await response.json();
        
        if (data.success) {
          this.analyticsData = data.data;
          this.emit('analytics_updated', data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    }, interval);
  }

  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

           getAnalyticsData(): unknown {
    return this.analyticsData;
  }
}

// Security-specific real-time service
class SecurityRealTimeService extends RealTimeService {
           private securityData: unknown = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    super({ url: 'ws://localhost:8084' });
    this.setupSecurityHandlers();
  }

  private setupSecurityHandlers(): void {
    this.on('security_update', (data) => {
      this.securityData = data;
      this.emit('security_updated', data);
    });

    this.on('connected', () => {
      this.subscribe('security');
    });
  }

  startRealTimeUpdates(interval: number = 10000): void {
    this.stopRealTimeUpdates();
    
    this.updateInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/security/monitoring');
        const data = await response.json();
        
        if (data.success) {
          this.securityData = data.data;
          this.emit('security_updated', data.data);
        }
      } catch (error) {
        console.error('Failed to fetch security data:', error);
      }
    }, interval);
  }

  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

           getSecurityData(): unknown {
    return this.securityData;
  }
}

// Onboarding-specific real-time service
class OnboardingRealTimeService extends RealTimeService {
           private onboardingEvents: unknown[] = [];

  constructor() {
    super({ url: 'ws://localhost:8084' });
    this.setupOnboardingHandlers();
  }

  private setupOnboardingHandlers(): void {
    this.on('onboarding_started', (data) => {
      this.onboardingEvents.push(data);
      this.emit('onboarding_event', data);
    });

    this.on('document_progress', (data) => {
      this.emit('document_progress', data);
    });

    this.on('document_completed', (data) => {
      this.emit('document_completed', data);
    });

    this.on('video_session_created', (data) => {
      this.emit('video_session_created', data);
    });

    this.on('sms_verified', (data) => {
      this.emit('sms_verified', data);
    });

    this.on('connected', () => {
      this.subscribe('onboarding');
    });
  }

           getOnboardingEvents(): unknown[] {
    return this.onboardingEvents;
  }

  clearOnboardingEvents(): void {
    this.onboardingEvents = [];
  }
}

// Export singleton instances
export const analyticsRealTimeService = new AnalyticsRealTimeService();
export const securityRealTimeService = new SecurityRealTimeService();
export const onboardingRealTimeService = new OnboardingRealTimeService();

// Export the base class for custom implementations
export { RealTimeService };
