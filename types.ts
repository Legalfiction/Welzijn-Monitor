export enum SystemStatus {
  ACTIVE = 'ACTIVE',
  WARNING = 'WARNING',
  ALERT_TRIGGERED = 'ALERT_TRIGGERED',
  DISABLED = 'DISABLED'
}

export interface EmergencyContact {
  id: string;
  name: string;
  email: string;
}

export interface SystemSettings {
  userName: string;
  contacts: EmergencyContact[];
  cloudUrl: string;
}

export interface HeartbeatLog {
  id: string;
  timestamp: number;
  source: string;
}