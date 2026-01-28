
export enum SystemStatus {
  ACTIVE = 'ACTIVE',
  WARNING = 'WARNING',
  ALERT_TRIGGERED = 'ALERT_TRIGGERED',
  DISABLED = 'DISABLED'
}

export interface SystemSettings {
  morningCheckTime: string; // e.g. "09:00"
  contactName: string;
  contactMethod: 'Email' | 'Telegram' | 'SMS';
  contactAddress: string;
  alertMessageTemplate: string;
  heartbeatIntervalMinutes: number;
}

export interface HeartbeatLog {
  id: string;
  timestamp: number;
  source: string;
  metadata?: Record<string, any>;
}

export interface AlertLog {
  id: string;
  timestamp: number;
  recipient: string;
  status: 'SENT' | 'FAILED' | 'ACKNOWLEDGED';
  content: string;
}
