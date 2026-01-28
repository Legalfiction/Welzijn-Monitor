
import React, { useState, useEffect, useCallback } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog, AlertLog } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import DashboardHeader from './components/DashboardHeader';
import SettingsPanel from './components/SettingsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import GuidePanel from './components/GuidePanel';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return (parsed && Array.isArray(parsed.contacts)) ? parsed : DEFAULT_SETTINGS;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSyncing, setIsSyncing] = useState(false);

  // Opslaan in localStorage bij wijzigingen
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
  }, [heartbeats]);

  const syncCloudStatus = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/heartbeat');
      if (res.ok) {
        console.log("Cloud Sync OK");
      }
    } catch (e) {
      console.error("Sync error", e);
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(syncCloudStatus, 30000);
    return () => clearInterval(interval);
  }, [syncCloudStatus]);

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
  };

  const testServerConnection = async () => {
    setIsPinging(true);
    setPingStatus('idle');
    try {
      const response = await fetch('/api/heartbeat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'Browser Control Panel' })
      });
      if (response.ok) {
        setPingStatus('success');
        const newLog: HeartbeatLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          source: 'Handmatige Test'
        };
        setHeartbeats(prev => [newLog, ...prev.slice(0, 14)]);
      } else {
        setPingStatus('error');
      }
    } catch (e) {
      setPingStatus('error');
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 safe-padding text-slate-900 bg-[#f8fafc]">
      <DashboardHeader 
        status={SystemStatus.ACTIVE} 
        lastHeartbeat={heartbeats[0]?.timestamp || null} 
      />

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cloud Verbinding</p>
            <p className="text-xs font-bold text-slate-700">Gereed voor signalen van MacroDroid</p>
          </div>
        </div>
        <button 
          onClick={syncCloudStatus}
          disabled={isSyncing}
          className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors"
        >
          <i className={`fas fa-sync-alt ${isSyncing ? 'animate-spin' : ''}`}></i> Nu Synchroniseren
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter text-slate-900">SYSTEEM VALIDATIE</h2>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Stuur een testsignaal naar de cloud</p>
                </div>
                {/* DE GEVRAAGDE KNOP */}
                <a 
                  href="https://vercel.com/aldohuizinga-gmailcoms-projects/welzijn-monitor/logs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <i className="fas fa-terminal"></i> OPEN MIJN LIVE PROJECT LOGS
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                  <p className="text-[11px] text-slate-600 mb-6 leading-relaxed">
                    Gebruik deze knop om te controleren of de server-endpoint <strong>/api/heartbeat</strong> actief is en signalen accepteert.
                  </p>
                  <button 
                    onClick={testServerConnection}
                    disabled={isPinging}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm ${
                      pingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                      pingStatus === 'error' ? 'bg-rose-500 text-white' :
                      'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                    }`}
                  >
                    {isPinging ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-paper-plane"></i>}
                    {isPinging ? 'VERZENDEN...' : pingStatus === 'success' ? 'SIGNAAL OK!' : 'TEST CLOUD VERBINDING'}
                  </button>
                </div>

                <div className="p-6 bg-indigo-50/30 border border-indigo-100 rounded-3xl">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">MacroDroid Feedback</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-[11px] text-slate-600">
                      <i className="fas fa-info-circle text-indigo-500 mt-0.5"></i>
                      <span>Signalen van je telefoon verschijnen <strong>direct</strong> in de Vercel Logs.</span>
                    </li>
                    <li className="flex gap-3 text-[11px] text-slate-600">
                      <i className="fas fa-info-circle text-indigo-500 mt-0.5"></i>
                      <span>Deze web-app is een dashboard voor instellingen, geen real-time console.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <GuidePanel />
          <ArchitectureDiagram />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SettingsPanel settings={settings} onUpdate={handleUpdateSettings} />
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <i className="fas fa-history"></i> Lokale Test Historie
             </h3>
             <div className="space-y-2">
                {heartbeats.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic text-center py-4">Geen lokale testen uitgevoerd.</p>
                ) : (
                  heartbeats.map(log => (
                    <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-700">{log.source}</span>
                      <span className="text-[9px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
             </div>
             <p className="mt-4 text-[9px] text-slate-400 leading-tight">
               Let op: Alleen acties vanuit deze browser worden hier getoond. Telefoonsignalen gaan direct naar de cloud-monitor.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
