
import { SystemSettings } from './types';

export const DEFAULT_SETTINGS: SystemSettings = {
  morningCheckTime: "09:00",
  contactName: "Willem de Boer",
  contactMethod: 'Email',
  contactAddress: "willem.demo@example.com",
  alertMessageTemplate: "GuardianSwitch Alert: Geen activiteit gedetecteerd voor de gebruiker sinds gisteren. Controleer a.u.b. onmiddellijk het welzijn.",
  heartbeatIntervalMinutes: 60,
};

export const STORAGE_KEYS = {
  SETTINGS: 'gs_settings',
  LOGS: 'gs_logs',
  ALERTS: 'gs_alerts',
  LAST_HEARTBEAT: 'gs_last_heartbeat'
};
