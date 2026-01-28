
import React, { useState, useEffect, useRef } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog } from './types.ts';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.ts';
import DashboardHeader from './components/DashboardHeader.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ArchitectureDiagram from './components/ArchitectureDiagram.tsx';
import GuidePanel from './components/GuidePanel.tsx';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [debugLogs, setDebugLogs] = useState<string[]>(["Systeem gereed. Gebruik de 'Cloud URL' bij Instellingen om te verbinden."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const isPreview = window.location.href.includes('googleusercontent.com') || window.location.href.includes('aistudio.google.com');

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, `[${time}] ${msg}`].slice(-10));
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debugLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const testServerConnection = async () => {
    if (isPinging) return;
    
    // Validatie
    const baseApi = settings.cloudUrl ? settings.cloudUrl.replace(/\/$/, '') : window.location.origin;
    const apiUrl = `${baseApi}/api/heartbeat`;

    if (isPreview && !settings.cloudUrl) {
      addLog("⚠️ WAARSCHUWING: Vul eerst je Vercel URL in bij 'Instellingen'!");
      setPingStatus('error');
      return;
    }

    setIsPinging(true);
    setPingStatus('idle');
    addLog(`🚀 Verbinden met: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      addLog("❌ TIMEOUT: Geen reactie. Is de URL correct en de API online?");
    }, 10000);

    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        mode: 'cors', // Forceer CORS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'Web Test Dashboard', isPreview: isPreview }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      addLog(`📥 Ontvangen: ${response.status} ${response.statusText}`);
      
      const text = await response.text();
      
      if (response.ok) {
        setPingStatus('success');
        addLog("✅ SUCCES! Je Vercel Cloud is bereikbaar.");
        setHeartbeats(prev => [{ id: Date.now().toString(), timestamp: Date.now(), source: 'Vercel Cloud Test' }, ...prev.slice(0, 14)]);
      } else {
        setPingStatus('error');
        addLog(`❌ FOUT ${response.status}: De API weigerde de toegang.`);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setPingStatus('error');
      addLog(`🚨 FOUT: ${err.message || 'Verbinding geblokkeerd'}`);
      addLog("Tip: Check of je Vercel URL eindigt op '.vercel.app'");
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-900 bg-[#f8fafc]">
      <DashboardHeader 
        status={SystemStatus.ACTIVE} 
        lastHeartbeat={heartbeats[0]?.timestamp || null} 
      />

      {isPreview && !settings.cloudUrl && (
        <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-3xl flex items-center gap-4 animate-bounce">
          <i className="fas fa-triangle-exclamation text-amber-500 text-xl"></i>
          <p className="text-xs font-bold text-amber-800">
            JE BENT IN PREVIEW MODE. Vul je <span className="underline">Vercel URL</span> in bij de instellingen om de API te testen!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-2xl font-black italic tracking-tighter mb-8 uppercase">SYSTEEM DIAGNOSTIEK</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <button 
                  onClick={testServerConnection}
                  disabled={isPinging}
                  className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${
                    pingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                    pingStatus === 'error' ? 'bg-rose-500 text-white' :
                    'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  {isPinging ? <i className="fas fa-sync animate-spin"></i> : <i className="fas fa-bolt"></i>}
                  {isPinging ? 'VERBINDEN...' : 'TEST VERCEL CLOUD'}
                </button>
                
                <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Live Cloud Console</span>
                  <div className="font-mono text-[9px] space-y-1 h-32 overflow-y-auto text-slate-300">
                    {debugLogs.map((log, i) => (
                      <div key={i} className="border-l border-slate-700 pl-2 py-0.5">{log}</div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex flex-col justify-center">
                <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-3">Hoe te testen?</h4>
                <ol className="text-[11px] text-indigo-800/70 space-y-2">
                  <li>1. Ga naar je <b>Vercel Dashboard</b></li>
                  <li>2. Kopieer de URL van je site</li>
                  <li>3. Plak deze bij <b>Cloud API URL</b> hiernaast</li>
                  <li>4. Druk op de grote blauwe knop</li>
                </ol>
              </div>
            </div>
          </section>

          <GuidePanel cloudUrl={settings.cloudUrl} />
          <ArchitectureDiagram />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SettingsPanel settings={settings} onUpdate={(s) => setSettings(s)} />
        </div>
      </div>
    </div>
  );
};

export default App;
