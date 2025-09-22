export interface NotificationData {
  title: string;
  body: string;
  data?: {
    screen?: string;
    url?: string;
    action?: string;
    userId?: string;
    [key: string]: any;
  };
  imageUrl?: string;
  actionUrl?: string;
}

export interface FCMTokenResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface NotificationPermissionStatus {
  authorized: boolean;
  provisional: boolean;
  denied: boolean;
  notDetermined: boolean;
}

export interface NotificationSettings {
  fcmToken: string | null;
  isEnabled: boolean;
  topics: string[];
  lastUpdated: Date;
}

export interface NotificationPayload {
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data?: {
    screen?: string;
    url?: string;
    action?: string;
    userId?: string;
    [key: string]: any;
  };
  topic?: string;
  token?: string;
}

export interface NotificationAction {
  id: string;
  title: string;
  action: () => void;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  importance: 'low' | 'normal' | 'high' | 'critical';
  enableVibration: boolean;
  enableSound: boolean;
  enableLights: boolean;
}

export type NotificationEventType = 
  | 'received'
  | 'opened'
  | 'dismissed'
  | 'failed';

export interface NotificationEvent {
  type: NotificationEventType;
  payload: NotificationData;
  timestamp: Date;
  id: string;
}
