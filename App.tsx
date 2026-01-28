
import React, { useState, useEffect } from 'react';
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
        return Array.isArray(parsed.contacts) ? parsed : DEFAULT_SETTINGS;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [alerts, setAlerts] = useState<AlertLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : [];
  });

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [heartbeats, alerts]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 safe-padding text-slate-900">
      <DashboardHeader status={SystemStatus.ACTIVE} lastHeartbeat={heartbeats[0]?.timestamp || null} />

      {/* DE ECHTE TEST SECTIE */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
           <i className="fas fa-satellite text-indigo-500/20 text-8xl -rotate-12"></i>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-white text-3xl font-black italic tracking-tighter mb-4">
            Stap 1: De "Muur van Tekst" Test
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Je telefoon praat rechtstreeks met de server. Omdat we geen dure database gebruiken, zie je de actie niet hier in de browser, maar <strong>DIRECT</strong> in de machinekamer van Vercel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://vercel.com/aldohuizinga-gmailcoms-projects/welzijn-monitor/logs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/20"
            >
              <i className="fas fa-external-link-alt"></i> Open Live Project Logs
            </a>
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Server Luistert...</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-black/50 border border-white/5 rounded-xl">
             <p className="text-indigo-400 text-[10px] font-bold mb-2 uppercase italic tracking-widest">Instructie voor Vercel Dashboard:</p>
             <p className="text-slate-500 text-[11px]">
               Zodra je op die knop klikt, zie je een zoekbalk. <strong>Wis alles wat in die zoekbalk staat</strong> (klik op het kruisje). Ontgrendel dan je telefoon. Je ziet direct een rode cirkel 🔴 met "HARTSLAG ONTVANGEN" verschijnen.
             </p>
          </div>
        </div>
      </div>

      <GuidePanel />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <ArchitectureDiagram />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SettingsPanel settings={settings} onUpdate={handleUpdateSettings} />
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <i className="fas fa-history"></i> Lokale App Sessie Logs
             </h3>
             <div className="space-y-2">
                {heartbeats.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">Alleen hartslagen verzonden vanuit DEZE browser verschijnen hier.</p>
                ) : (
                  heartbeats.map(log => (
                    <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-700">{log.source}</span>
                      <span className="text-[9px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
