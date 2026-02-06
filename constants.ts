
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
  // Updated with the user-provided production URL base
  cloudUrl: 'https://48dyecg3g71mao37dp2e4bm7dkjswdrp42ozwrfgra4ln60bwd-h864888888.scf.usercontent.goog', 
};

export const STORAGE_KEYS = {
  SETTINGS: 'gs_settings_v16_prod', 
  LOGS: 'gs_logs_v16_prod',
  ALERTS: 'gs_alerts_v16_prod'
};
