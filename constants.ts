
import { SystemSettings } from './types';

export const DEFAULT_SETTINGS: SystemSettings = {
  contacts: [
    {
      id: '1',
      name: "Aldo Huizinga",
      method: 'Email',
      address: "aldo.huizinga@gmail.com"
    }
  ],
  alertMessageTemplate: "GuardianSwitch Alert: Onmiddellijke welzijnscheck vereist.",
  cloudUrl: '', 
};

export const STORAGE_KEYS = {
  SETTINGS: 'gs_settings_live', 
  LOGS: 'gs_logs_live',
  ALERTS: 'gs_alerts_live'
};
