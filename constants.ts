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
  alertMessageTemplate: "GuardianSwitch Alert: Onmiddellijke welzijnscheck vereist voor Aldo Huizinga.",
  cloudUrl: 'https://welzijn-monitor.vercel.app', 
};

export const STORAGE_KEYS = {
  SETTINGS: 'gs_settings_v15_stable', 
  LOGS: 'gs_logs_v15_stable',
  ALERTS: 'gs_alerts_v15_stable'
};