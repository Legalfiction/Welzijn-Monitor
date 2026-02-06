
export enum SystemStatus {
  ACTIVE = 'ACTIVE',
  WARNING = 'WARNING',
  ALERT_TRIGGERED = 'ALERT_TRIGGERED',
  DISABLED = 'DISABLED'
}

export interface EmergencyContact {
  id: string;
  name: string;
  method: 'Email' | 'Telegram' | 'SMS';
  address: string;
}

export interface SystemSettings {
  contacts: EmergencyContact[];
  alertMessageTemplate: string;
  cloudUrl: string;
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
