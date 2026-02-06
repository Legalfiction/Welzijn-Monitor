import { SystemSettings } from './types';

export const DEFAULT_SETTINGS: SystemSettings = {
  userName: "Systeem Operator",
  contacts: [
    { id: '1', name: "Aldo Huizinga", email: "aldo.huizinga@gmail.com" }
  ],
  cloudUrl: '', 
};

export const STORAGE_KEYS = {
  SETTINGS: 'gs_v2_settings',
  LOGS: 'gs_v2_logs'
};