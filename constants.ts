
import { SystemSettings } from './types';

export const DEFAULT_SETTINGS: SystemSettings = {
  morningCheckTime: "09:00",
  contacts: [
    {
      id: '1',
      name: "Willem de Boer",
      method: 'Email',
      address: "willem.demo@example.com"
    }
  ],
  alertMessageTemplate: "GuardianSwitch Alert: Geen activiteit gedetecteerd voor de gebruiker sinds gisteren. Controleer a.u.b. onmiddellijk het welzijn.",
  heartbeatIntervalMinutes: 60,
};

export const STORAGE_KEYS = {
  SETTINGS: 'gs_settings_v2',
  LOGS: 'gs_logs',
  ALERTS: 'gs_alerts',
  LAST_HEARTBEAT: 'gs_last_heartbeat'
};
