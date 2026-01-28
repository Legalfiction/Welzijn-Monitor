
import React, { useState, useEffect } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog, AlertLog } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import DashboardHeader from './components/DashboardHeader';
import SettingsPanel from './components/SettingsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import GuidePanel from './components/GuidePanel';

const App: React.FC = () => {
  // We laden settings en behouden wat de gebruiker heeft ingevoerd
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Controleer of het een geldig object is met de benodigde velden
        return (parsed && Array.isArray(parsed.contacts)) ? parsed : DEFAULT_SETTINGS;
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

  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  // Functie om de server ECHT te testen vanuit de browser
  const testServerConnection = async () => {
    setIsPinging(true);
    setPingStatus('idle');
    try {
      const response = await fetch('/api/heartbeat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setPingStatus('success');
        // Voeg toe aan lokale sessie log
        const newLog: HeartbeatLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          source: 'Browser Test Button'
        };
        setHeartbeats(prev => [newLog, ...prev.slice(0, 19)]);
      } else {
        setPingStatus('error');
      }
    } catch (e) {
      setPingStatus('error');
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [heartbeats, alerts]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 safe-padding text-slate-900">
      <DashboardHeader status={SystemStatus.ACTIVE} lastHeartbeat={heartbeats[0]?.timestamp || null} />

      {/* COMMAND CENTER VOOR ECHTE TESTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-white text-3xl font-black italic tracking-tighter">
                Live Systeem Controle
              </h2>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
                Verifieer de verbinding tussen Telefoon, Server en Cloud
              </p>
            </div>
            
            <a 
              href="https://vercel.com/aldohuizinga-gmailcoms-projects/welzijn-monitor/logs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <i className="fas fa-terminal"></i> Open Vercel Project Logs
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LINKER KANT: TEST ACTIE */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <h3 className="text-white font-bold text-sm mb-4">Stap 1: Test Server Response</h3>
              <p className="text-slate-500 text-[11px] mb-6">
                Klik op de knop hieronder om een handmatige hartslag naar de Vercel server te sturen. 
                Als dit werkt, zie je direct een nieuwe regel verschijnen in je Vercel Logs (vergeet niet de filters te wissen!).
              </p>
              
              <button 
                onClick={testServerConnection}
                disabled={isPinging}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                  pingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                  pingStatus === 'error' ? 'bg-rose-500 text-white' :
                  'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                {isPinging ? (
                  <><i className="fas fa-spinner animate-spin"></i> VERZENDEN...</>
                ) : pingStatus === 'success' ? (
                  <><i className="fas fa-check-circle"></i> SIGNAAL ONTVANGEN!</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Stuur Handmatige Test-Hartslag</>
                )}
              </button>
            </div>

            {/* RECHTER KANT: UITLEG LOGS */}
            <div className="bg-black/30 border border-white/5 p-6 rounded-3xl">
              <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">Vercel Log Instructies</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p className="text-slate-400 text-[11px]">Klik op de knop bovenaan om je Vercel Logs te openen.</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p className="text-slate-400 text-[11px]">In de zoekbalk op Vercel staat vaak tekst. <strong>Klik op het kruisje (X)</strong> om alle filters te wissen.</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p className="text-slate-400 text-[11px]">Ontgrendel nu je telefoon. Je ziet een 🔴 verschijnen in de Vercel console.</p>
                </div>
              </div>
            </div>
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
               <i className="fas fa-history"></i> Sessie Historie (Lokaal)
             </h3>
             <div className="space-y-2">
                {heartbeats.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">Nog geen activiteiten geregistreerd in deze browser-sessie.</p>
                ) : (
                  heartbeats.map(log => (
                    <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in">
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
