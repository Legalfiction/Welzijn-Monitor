
import React, { useState, useEffect, useCallback } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog, AlertLog } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import DashboardHeader from './components/DashboardHeader';
import SettingsPanel from './components/SettingsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import GuidePanel from './components/GuidePanel';
import { generateRefinedAlert, auditSafetyLogs } from './services/geminiService';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [alerts, setAlerts] = useState<AlertLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>(SystemStatus.ACTIVE);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [auditResult, setAuditResult] = useState<string>("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [isTestingAlert, setIsTestingAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
  }, [heartbeats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  const sendHeartbeat = useCallback((source: string = 'App Activiteit') => {
    const newLog: HeartbeatLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      source,
      metadata: { batteryLevel }
    };
    setHeartbeats(prev => [newLog, ...prev].slice(0, 50));
    setSystemStatus(SystemStatus.ACTIVE);
  }, [batteryLevel]);

  const testAlert = async () => {
    setIsTestingAlert(true);
    const lastSeenStr = heartbeats[0] ? new Date(heartbeats[0].timestamp).toLocaleString('nl-NL') : "Nooit";
    const refinedMessage = await generateRefinedAlert("Gebruiker", settings.contactName, lastSeenStr);
    
    const newAlert: AlertLog = {
      id: "TEST-" + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      recipient: settings.contactName,
      status: 'SENT',
      content: refinedMessage || "Dit is een testbericht van GuardianSwitch."
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    setIsTestingAlert(false);
  };

  const runMorningCheck = useCallback(async () => {
    const now = new Date();
    const [checkHour, checkMinute] = settings.morningCheckTime.split(':').map(Number);
    const morningCheckTimeToday = new Date();
    morningCheckTimeToday.setHours(checkHour, checkMinute, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const lastLog = heartbeats[0];
    const lastActivityTimestamp = lastLog ? lastLog.timestamp : 0;

    if (now.getTime() >= morningCheckTimeToday.getTime() && lastActivityTimestamp < todayStart.getTime()) {
      if (systemStatus !== SystemStatus.ALERT_TRIGGERED) {
        setSystemStatus(SystemStatus.WARNING);
        
        if (batteryLevel && batteryLevel < 5) return;

        const lastSeenStr = lastActivityTimestamp === 0 ? "Nooit" : new Date(lastActivityTimestamp).toLocaleString('nl-NL');
        const refinedMessage = await generateRefinedAlert("Gebruiker", settings.contactName, lastSeenStr);
        
        const newAlert: AlertLog = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          recipient: settings.contactName,
          status: 'SENT',
          content: refinedMessage || settings.alertMessageTemplate
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        setSystemStatus(SystemStatus.ALERT_TRIGGERED);
      }
    }
  }, [settings, heartbeats, systemStatus, batteryLevel]);

  useEffect(() => {
    const interval = setInterval(runMorningCheck, 60000);
    return () => clearInterval(interval);
  }, [runMorningCheck]);

  const performAudit = async () => {
    setIsAuditing(true);
    const result = await auditSafetyLogs(heartbeats.slice(0, 10));
    setAuditResult(result);
    setIsAuditing(false);
  };

  const lastHeartbeat = heartbeats[0]?.timestamp || null;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 safe-padding">
      <DashboardHeader status={systemStatus} lastHeartbeat={lastHeartbeat} />

      <GuidePanel />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
             <div className="flex flex-wrap items-center justify-between gap-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Handmatige Acties</h3>
                  <p className="text-sm text-slate-500">Test je verbinding en alarmen.</p>
               </div>
               <div className="flex flex-wrap gap-3">
                 <button 
                  onClick={() => sendHeartbeat()}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl border border-slate-200 transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95"
                 >
                   <i className="fas fa-heartbeat text-rose-500"></i> Hartslag
                 </button>
                 <button 
                  onClick={testAlert}
                  disabled={isTestingAlert}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50 active:scale-95"
                 >
                   <i className="fas fa-paper-plane"></i> {isTestingAlert ? '...' : 'Test Alarm'}
                 </button>
               </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <i className="fas fa-robot text-indigo-600"></i> AI Gezondheidscheck
                </h3>
                <button 
                  onClick={performAudit}
                  disabled={isAuditing}
                  className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                  {isAuditing ? 'Analyseert...' : 'Start Audit'}
                </button>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[80px] flex items-center">
               <p className="text-sm text-slate-600 leading-relaxed italic">
                 {auditResult || "Klik op 'Start Audit' voor een patronen-check door Gemini."}
               </p>
             </div>
          </div>

          <div className="hidden md:block">
            <ArchitectureDiagram />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SettingsPanel settings={settings} onUpdate={setSettings} />

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-h-[400px] overflow-y-auto">
             <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <i className="fas fa-history"></i> Activiteitslog
             </h3>
             <div className="space-y-2">
               {heartbeats.length === 0 && <p className="text-xs text-slate-400 italic">Geen activiteit...</p>}
               {heartbeats.map((log) => (
                 <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-700">{log.source}</span>
                    <span className="text-[11px] text-slate-400 mono">{new Date(log.timestamp).toLocaleTimeString('nl-NL')}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-slate-400 pt-8 pb-4">
        <p className="text-[10px] font-bold tracking-widest uppercase">GUARDIANSWITCH CLOUD PROTOCOL v2.0</p>
      </footer>
    </div>
  );
};

export default App;
