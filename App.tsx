
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
  const [serverFeedback, setServerFeedback] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
  }, [heartbeats]);

  const syncCloudStatus = useCallback(async () => {
    setIsSyncing(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      await fetch('/api/heartbeat', { signal: controller.signal });
      clearTimeout(timeoutId);
    } catch (e) {
      console.warn("Sync background check failed (non-critical)");
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(syncCloudStatus, 60000); // Minder frequent om overhead te beperken
    return () => clearInterval(interval);
  }, [syncCloudStatus]);

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
  };

  const testServerConnection = async () => {
    setIsPinging(true);
    setPingStatus('idle');
    setServerFeedback(null);
    
    // Timeout van 8 seconden toevoegen om 'oneindig draaien' te voorkomen
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      console.log("🚀 Start testServerConnection...");
      const response = await fetch('/api/heartbeat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: 'Manual Test',
          timestamp: Date.now()
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setPingStatus('success');
        setServerFeedback(`Server bevestigd om: ${data.serverTime || 'Onbekende tijd'}`);
        const newLog: HeartbeatLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          source: 'Browser Test'
        };
        setHeartbeats(prev => [newLog, ...prev.slice(0, 14)]);
      } else {
        console.error("Server error response:", response.status);
        setPingStatus('error');
        setServerFeedback(`Fout: Server gaf code ${response.status}`);
      }
    } catch (e: any) {
      console.error("Fetch error details:", e);
      setPingStatus('error');
      if (e.name === 'AbortError') {
        setServerFeedback("Fout: Server timeout (geen antwoord)");
      } else {
        setServerFeedback("Fout: Kon geen verbinding maken");
      }
    } finally {
      setIsPinging(false);
      clearTimeout(timeoutId);
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status: Luisteren</p>
            <p className="text-xs font-bold text-slate-700">Wachtend op signalen van je telefoon...</p>
          </div>
        </div>
        <div className="flex gap-4">
          <p className="text-[9px] text-slate-400 max-w-[200px] text-right leading-tight hidden md:block">
            Let op: Het openen van deze app logt niets. Ontgrendel je telefoon of gebruik de testknop.
          </p>
          <button 
            onClick={syncCloudStatus}
            disabled={isSyncing}
            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
          >
            <i className={`fas fa-sync-alt ${isSyncing ? 'animate-spin' : ''}`}></i> Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter text-slate-900">VERBINDINGSTEST</h2>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Dwing een log-vermelding af</p>
                </div>
                <a 
                  href="https://vercel.com/aldohuizinga-gmailcoms-projects/welzijn-monitor/logs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-terminal"></i> OPEN MIJN LIVE PROJECT LOGS
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                  <p className="text-[11px] text-slate-600 mb-6 leading-relaxed">
                    Klik hieronder. Als de knop groen wordt, <b>moet</b> er een melding met sterren in de Vercel Logs verschijnen.
                  </p>
                  <button 
                    onClick={testServerConnection}
                    disabled={isPinging}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm ${
                      pingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                      pingStatus === 'error' ? 'bg-rose-500 text-white' :
                      'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 active:scale-95'
                    }`}
                  >
                    {isPinging ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bolt"></i>}
                    {isPinging ? 'VERZENDEN...' : pingStatus === 'success' ? 'CLOUD ONTVANGEN!' : pingStatus === 'error' ? 'OPNIEUW PROBEREN' : 'STUUR TEST-SIGNAAL'}
                  </button>
                  {serverFeedback && (
                    <p className={`mt-3 text-[10px] font-bold text-center animate-pulse ${pingStatus === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {serverFeedback}
                    </p>
                  )}
                </div>

                <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                  <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4">BELANGRIJK: VERCEL LOGS</h4>
                  <p className="text-[11px] text-amber-800/80 leading-relaxed mb-4">
                    Vercel filtert logs vaak op de "huidige deployment". Als je een verandering in de code hebt gemaakt, zie je in de oude tab geen nieuwe logs.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-900">
                    <i className="fas fa-info-circle"></i>
                    <span>Klik op de knop bovenaan voor de actieve log-view!</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <GuidePanel />
          <ArchitectureDiagram />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SettingsPanel settings={settings} onUpdate={handleUpdateSettings} />
        </div>
      </div>
    </div>
  );
};

export default App;
