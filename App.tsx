
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

  const sendHeartbeat = useCallback((source: string = 'Android (Simulatie)') => {
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
        
        if (batteryLevel && batteryLevel < 5) {
          console.warn("Lage batterij gedetecteerd. Alarm uitgesteld.");
          return;
        }

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
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <DashboardHeader status={systemStatus} lastHeartbeat={lastHeartbeat} />

      {/* Guide Section */}
      <GuidePanel />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Linkerkant: Acties en Logica */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
             <div className="flex flex-wrap items-center justify-between gap-4">
               <div>
                  <h3 className="text-lg font-semibold mb-1">Simulatie & Test</h3>
                  <p className="text-sm text-slate-400">Gebruik deze knoppen om de werking te controleren.</p>
               </div>
               <div className="flex gap-3">
                 <button 
                  onClick={() => sendHeartbeat()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg border border-slate-600 transition-all flex items-center gap-2 text-sm"
                 >
                   <i className="fas fa-heartbeat text-indigo-400"></i> Stuur Hartslag
                 </button>
                 <button 
                  onClick={testAlert}
                  disabled={isTestingAlert}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                 >
                   <i className="fas fa-paper-plane"></i> {isTestingAlert ? 'Testen...' : 'Test Alarm'}
                 </button>
               </div>
             </div>
          </div>

          <ArchitectureDiagram />

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-robot text-indigo-400"></i> AI Veiligheidsanalyse (Gemini)
                </h3>
                <button 
                  onClick={performAudit}
                  disabled={isAuditing}
                  className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  {isAuditing ? 'Analyseren...' : 'Start Analyse'}
                </button>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 min-h-[80px] flex items-center">
               {auditResult ? (
                 <p className="text-sm text-slate-300 leading-relaxed italic">"{auditResult}"</p>
               ) : (
                 <p className="text-sm text-slate-500 italic">Klik op 'Start Analyse' om je activiteitspatroon door de AI te laten controleren op onregelmatigheden.</p>
               )}
             </div>
          </div>
        </div>

        {/* Rechterkant: Instellingen en Geschiedenis */}
        <div className="lg:col-span-4 space-y-8">
          <SettingsPanel settings={settings} onUpdate={setSettings} />

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl max-h-[350px] overflow-y-auto">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
               <i className="fas fa-history text-slate-400"></i> Recente Hartslagen
             </h3>
             <div className="space-y-2">
               {heartbeats.length === 0 && <p className="text-xs text-slate-600 italic">Wachten op eerste signaal...</p>}
               {heartbeats.map((log) => (
                 <div key={log.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      <span className="text-xs text-slate-300">{log.source}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mono">{new Date(log.timestamp).toLocaleTimeString('nl-NL')}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-slate-900 border border-red-900/20 rounded-xl p-6 shadow-xl max-h-[350px] overflow-y-auto">
             <h3 className="text-sm font-bold uppercase tracking-widest text-red-500/70 mb-4 flex items-center gap-2">
               <i className="fas fa-bell"></i> Alarm Geschiedenis
             </h3>
             <div className="space-y-3">
               {alerts.length === 0 && <p className="text-xs text-slate-600 italic">Geen alarmen verzonden.</p>}
               {alerts.map((alert) => (
                 <div key={alert.id} className="p-3 bg-red-900/5 border border-red-900/20 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] text-red-400 font-bold">{alert.recipient}</p>
                      <p className="text-[9px] text-slate-500 mono">{new Date(alert.timestamp).toLocaleTimeString('nl-NL')}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{alert.content}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-slate-600 pt-8 pb-4">
        <p className="text-xs font-medium">GuardianSwitch &copy; 2024 - Uw persoonlijke digitale veiligheid.</p>
      </footer>
    </div>
  );
};

export default App;
