// Notification Service for managing user notifications
import { faker } from '@faker-js/faker';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  category: 'system' | 'feature' | 'security' | 'analytics';
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    system: boolean;
    feature: boolean;
    security: boolean;
    analytics: boolean;
  };
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private settings: NotificationSettings = {
    email: true,
    push: true,
    sms: false,
    categories: {
      system: true,
      feature: true,
      security: true,
      analytics: true
    }
  };

  constructor() {
    this.initializeMockNotifications();
  }

  private initializeMockNotifications() {
    const mockNotifications: Notification[] = [
      {
        id: 'notif_1',
        type: 'success',
        title: 'SMS Verification Completed',
        message: 'Phone number +1234567890 has been successfully verified.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        category: 'feature',
        priority: 'medium'
      },
      {
        id: 'notif_2',
        type: 'info',
        title: 'Video Session Scheduled',
        message: 'Your onboarding video call has been scheduled for tomorrow at 2:00 PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        category: 'feature',
        priority: 'high'
      },
      {
        id: 'notif_3',
        type: 'warning',
        title: 'Document Generation Failed',
        message: 'Failed to generate welcome packet. Please try again.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: true,
        category: 'feature',
        priority: 'medium'
      },
      {
        id: 'notif_4',
        type: 'error',
        title: 'Security Alert',
        message: 'Unusual login activity detected from a new location.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        read: false,
        category: 'security',
        priority: 'high'
      },
      {
        id: 'notif_5',
        type: 'info',
        title: 'Analytics Report Ready',
        message: 'Your monthly onboarding analytics report is now available.',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        read: true,
        category: 'analytics',
        priority: 'low'
      }
    ];

    mockNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return Array.from(this.notifications.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.getNotifications().filter(notification => !notification.read);
  }

  // Get notification count
  getNotificationCount(): number {
    return this.getUnreadNotifications().length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  // Add new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  // Delete notification
  deleteNotification(notificationId: string): boolean {
    return this.notifications.delete(notificationId);
  }

  // Get notification settings
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Update notification settings
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  // Generate mock notification
  generateMockNotification(): Notification {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error'];
    const categories: Notification['category'][] = ['system', 'feature', 'security', 'analytics'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high'];

    const mockTitles = [
      'New Feature Available',
      'System Maintenance',
      'Security Update',
      'Analytics Report',
      'Document Generated',
      'Team Invitation',
      'Video Call Reminder',
      'SMS Verification',
      'Account Update',
      'Performance Alert'
    ];

    const mockMessages = [
      'A new feature has been added to your dashboard.',
      'Scheduled maintenance will occur tonight at 2 AM.',
      'Security settings have been updated.',
      'Your weekly analytics report is ready.',
      'Document has been successfully generated.',
      'You have been invited to join a team.',
      'Your video call starts in 15 minutes.',
      'SMS verification code has been sent.',
      'Your account information has been updated.',
      'System performance is below optimal levels.'
    ];

    return this.addNotification({
      type: faker.helpers.arrayElement(types),
      title: faker.helpers.arrayElement(mockTitles),
      message: faker.helpers.arrayElement(mockMessages),
      read: false,
      category: faker.helpers.arrayElement(categories),
      priority: faker.helpers.arrayElement(priorities)
    });
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications.clear();
  }

  // Get notifications by category
  getNotificationsByCategory(category: Notification['category']): Notification[] {
    return this.getNotifications().filter(notification => notification.category === category);
  }

  // Get notifications by type
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.getNotifications().filter(notification => notification.type === type);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
