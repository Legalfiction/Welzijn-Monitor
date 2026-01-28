
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
        return (parsed && Array.isArray(parsed.contacts)) ? parsed : DEFAULT_SETTINGS;
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
  const [debugLogs, setDebugLogs] = useState<string[]>(["Systeem gereed. Wachten op actie..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, `[${time}] ${msg}`].slice(-10));
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debugLogs]);

  const testServerConnection = async () => {
    if (isPinging) return;
    
    setIsPinging(true);
    setPingStatus('idle');
    addLog("🚀 Start verbindingstest...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      addLog("❌ TIMEOUT: Geen reactie van server na 8 seconden.");
    }, 8000);

    try {
      const apiUrl = '/api/heartbeat';
      addLog(`📡 Roep aan: ${apiUrl}`);

      const response = await fetch(apiUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      addLog(`📥 Status ontvangen: ${response.status} ${response.statusText}`);
      
      const text = await response.text();
      addLog(`📝 Ruwe data: ${text.substring(0, 50)}...`);

      if (response.ok) {
        setPingStatus('success');
        addLog("✅ SUCCES: Verbinding met Cloud is stabiel.");
        setHeartbeats(prev => [{ id: Date.now().toString(), timestamp: Date.now(), source: 'Handmatige Test' }, ...prev.slice(0, 14)]);
      } else {
        setPingStatus('error');
        addLog(`❌ FOUT: Server gaf een probleem aan (Code ${response.status}).`);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setPingStatus('error');
      if (err.name === 'AbortError') {
        addLog("🚨 AFGEBROKEN: Netwerkverbinding duurde te lang.");
      } else {
        addLog(`🚨 NETWERKFOUT: ${err.message || 'Onbekende fout'}`);
        addLog("Tip: Controleer of je internet hebt en of Vercel online is.");
      }
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter">SYSTEEM DIAGNOSTIEK</h2>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Test de Cloud-integratie</p>
              </div>
            </div>

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
                  {isPinging ? 'TESTEN...' : 'VERBINDING TESTEN'}
                </button>
                
                <div className="bg-slate-900 rounded-3xl p-5 shadow-inner border border-slate-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Systeem Logboek</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] space-y-1 h-32 overflow-y-auto text-slate-300">
                    {debugLogs.map((log, i) => (
                      <div key={i} className="border-l border-slate-700 pl-2 py-0.5">{log}</div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex flex-col justify-center">
                <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-3">Hulp bij Chromebook</h4>
                <p className="text-[11px] text-indigo-800/70 leading-relaxed mb-4">
                  Omdat je geen F12 hebt, toont het zwarte schermpje hiernaast precies wat er misgaat. 
                </p>
                <div className="bg-white/50 p-3 rounded-xl border border-indigo-200">
                   <p className="text-[10px] font-bold text-indigo-900">Sneltoets voor Console:</p>
                   <code className="text-xs font-black text-indigo-600">Ctrl + Shift + J</code>
                </div>
              </div>
            </div>
          </section>

          <GuidePanel />
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
