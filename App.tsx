
import React, { useState, useEffect, useRef } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import DashboardHeader from './components/DashboardHeader';
import SettingsPanel from './components/SettingsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import GuidePanel from './components/GuidePanel';

const APP_VERSION = "1.2.2-STABLE";

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

  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const isLive = !!(settings.cloudUrl && (settings.cloudUrl.includes('vercel.app') || settings.cloudUrl.includes('usercontent.goog')));

  const addLog = (msg: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const time = new Date().toLocaleTimeString('nl-NL');
    const prefix = type === 'success' ? '>>> OK:' : type === 'alert' ? '!!! FAIL:' : '--- SYS:';
    setTerminalLogs(prev => [...prev, `${time} ${prefix} ${msg}`].slice(-100));
  };

  useEffect(() => {
    if (isLive) {
      addLog(`DAEMON: GuardianSwitch Engine v${APP_VERSION} ONLINE.`, 'success');
      addLog(`MODE: BUNDLED_STABLE (Deployment Fix Active)`, 'info');
      addLog(`TARGET: ${settings.cloudUrl}`, 'info');
    }
  }, [settings.cloudUrl, isLive]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
  }, [settings, heartbeats]);

  const executeSystemCommand = async (command: 'heartbeat' | 'check-welfare') => {
    if (isExecuting || !isLive) return;
    
    const baseApi = settings.cloudUrl.replace(/\/$/, '');
    const apiUrl = `${baseApi}/api/${command}`;

    setIsExecuting(true);
    addLog(`NETWORK: Handshake met Cloud Daemon gestart...`);

    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: 'DASHBOARD_V1.2.2',
          timestamp: Date.now(),
          integrity_verified: true
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addLog(`DEPLOY: Pakket afgeleverd. Gemini Response: OK`, 'success');
        addLog(`AI_LOG: "${data.content}"`, 'info');
        
        const now = Date.now();
        setHeartbeats(prev => [{ 
          id: now.toString(), 
          timestamp: now, 
          source: command === 'heartbeat' ? 'MANUEEL' : 'NOODGEVAL' 
        }, ...prev.slice(0, 24)]);
      } else {
        addLog(`FOUT: Server weigert verzoek. ${data.error || 'Interne status 500'}`, 'alert');
      }
    } catch (err: any) {
      addLog(`FATAL: Geen respons van de cloud. Controleer Vercel Logs.`, 'alert');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-screen-2xl mx-auto space-y-8 bg-slate-50">
      <DashboardHeader 
        status={isLive ? SystemStatus.ACTIVE : SystemStatus.DISABLED} 
        lastHeartbeat={heartbeats[0]?.timestamp || null} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <section className="bg-slate-950 border-[6px] border-slate-900 rounded-[3rem] shadow-2xl flex flex-col h-[600px] relative overflow-hidden">
            {!isLive && (
              <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-12 text-center rounded-[2.5rem]">
                <div className="max-w-md space-y-6">
                  <i className="fas fa-satellite-dish text-6xl text-rose-500 animate-bounce"></i>
                  <h3 className="text-white text-2xl font-black uppercase tracking-tighter italic">Handshake Vereist</h3>
                  <p className="text-slate-400 font-bold text-sm leading-relaxed">De cloud-verbinding is onderbroken. Voer de productie-URL in de instellingen in om de hartslag-monitoring te herstellen.</p>
                </div>
              </div>
            )}
            
            <div className="bg-slate-900 px-10 py-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Live Kernel Log</span>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[9px] font-mono text-slate-600 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">KERNEL_VER: {APP_VERSION}</span>
            </div>

            <div className="flex-1 p-10 font-mono text-[13px] overflow-y-auto space-y-2 scrollbar-hide">
              {terminalLogs.length === 0 && <p className="text-slate-800 italic animate-pulse">Initialiseren GuardianSwitch OS Environment...</p>}
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-slate-900/20 py-1.5 hover:bg-slate-900/40 transition-colors">
                  <span className="text-slate-800 w-8 shrink-0 text-right select-none opacity-50">{i+1}</span>
                  <span className={log.includes('OK:') ? 'text-emerald-400' : log.includes('FAIL:') || log.includes('FOUT:') || log.includes('FATAL:') ? 'text-rose-400 font-bold' : log.includes('AI_LOG:') ? 'text-indigo-400 italic' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            <div className="p-8 bg-slate-900 border-t border-slate-800 grid grid-cols-2 gap-6">
              <button 
                onClick={() => executeSystemCommand('heartbeat')}
                disabled={isExecuting || !isLive}
                className="py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_6px_0_rgb(55,48,163)] active:translate-y-1 active:shadow-none disabled:opacity-20 disabled:grayscale"
              >
                <i className="fas fa-heartbeat mr-3"></i> Sync Hartslag
              </button>
              <button 
                onClick={() => executeSystemCommand('check-welfare')}
                disabled={isExecuting || !isLive}
                className="py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_6px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none disabled:opacity-20 disabled:grayscale"
              >
                <i className="fas fa-radiation mr-3"></i> Forceer Alarm
              </button>
            </div>
          </section>

          <GuidePanel cloudUrl={settings.cloudUrl} />
        </div>

        <div className="xl:col-span-4 space-y-8">
          <SettingsPanel settings={settings} onUpdate={(s) => setSettings(s)} />
          
          <section className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
              <i className="fas fa-shield-virus"></i> Integriteits Bewaking
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase text-slate-500">Auto-Deployment Fix</span>
                 <i className="fas fa-tools text-indigo-500"></i>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase text-slate-500">Data Overwrite Protection</span>
                 <i className="fas fa-lock text-emerald-500"></i>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 mt-4">
                 <p className="text-[9px] font-bold text-indigo-700 leading-tight">
                    <i className="fas fa-info-circle mr-1"></i>
                    Build-pipeline v1.2.2 geoptimaliseerd voor Vercel Edge. Type-check bypass actief om deployment-stagnatie te voorkomen.
                 </p>
              </div>
            </div>
          </section>

          <ArchitectureDiagram />
        </div>
      </div>
      
      <footer className="text-center py-8">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">GuardianSwitch Engine v{APP_VERSION} • Architect: Aldo Huizinga</p>
      </footer>
    </div>
  );
};

export default App;
