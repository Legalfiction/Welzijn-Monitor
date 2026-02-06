
import React, { useState, useEffect, useRef } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog } from './types.ts';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.ts';
import DashboardHeader from './components/DashboardHeader.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ArchitectureDiagram from './components/ArchitectureDiagram.tsx';
import GuidePanel from './components/GuidePanel.tsx';

const BUILD_ID = "PROD_HUIZINGA_V2_FEB2025";

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
  const [healthSyncStatus, setHealthSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS'>('SUCCESS');
  const logEndRef = useRef<HTMLDivElement>(null);

  const isLive = settings.cloudUrl && (settings.cloudUrl.includes('vercel.app') || settings.cloudUrl.includes('usercontent.goog'));

  const addLog = (msg: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const time = new Date().toLocaleTimeString('nl-NL');
    const prefix = type === 'success' ? '>>> SUCCESS:' : type === 'alert' ? '!!! ERROR:' : '--- SYSTEM:';
    setTerminalLogs(prev => [...prev, `${time} ${prefix} ${msg}`].slice(-100));
  };

  useEffect(() => {
    if (isLive) {
      addLog(`STATUS: Productie Monitor gekoppeld aan ${settings.cloudUrl}`, 'success');
      addLog(`DAEMON: Welzijns-integratie voor Aldo Huizinga actief.`, 'info');
    } else {
      addLog("WAARSCHUWING: Geen geldige productie URL geconfigureerd.", 'alert');
    }
  }, [settings.cloudUrl]);

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
    addLog(`COMMUNICATIE_PROTOCOL_V1: Start handshake met ${apiUrl}`);

    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: 'DASHBOARD_HUIZINGA',
          timestamp: Date.now()
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addLog(`SYNC_OK: Update afgeleverd. Resend Status: VERZONDEN.`, 'success');
        addLog(`AI_MSG: "${data.content}"`, 'info');
        
        const now = Date.now();
        setHeartbeats(prev => [{ 
          id: now.toString(), 
          timestamp: now, 
          source: command === 'heartbeat' ? 'MANUEEL' : 'NOODGEVAL' 
        }, ...prev.slice(0, 24)]);
      } else {
        addLog(`REFUSED: Server weigert connectie. Reden: ${data.error}`, 'alert');
      }
    } catch (err: any) {
      addLog(`NETWORK_TIMEOUT: Kan geen verbinding maken met de monitoring-daemon.`, 'alert');
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
          <section className="bg-slate-950 border-[6px] border-slate-900 rounded-[3rem] shadow-2xl flex flex-col h-[600px] relative">
            {!isLive && (
              <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-12 text-center rounded-[2.5rem]">
                <div className="max-w-md space-y-6">
                  <i className="fas fa-link-slash text-6xl text-rose-500 animate-pulse"></i>
                  <h3 className="text-white text-2xl font-black uppercase italic tracking-tighter">Handshake Vereist</h3>
                  <p className="text-slate-400 font-bold text-sm">De monitoring-daemon is offline. Configureer de productie URL in de instellingen om de hartslag-monitoring te activeren.</p>
                </div>
              </div>
            )}
            
            <div className="bg-slate-900 px-10 py-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">System Log Stream</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500"></div>
              </div>
            </div>

            <div className="flex-1 p-10 font-mono text-[13px] overflow-y-auto space-y-2">
              {terminalLogs.length === 0 && <p className="text-slate-800 italic">Laden van GuardianSwitch Kernel...</p>}
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-slate-900/30 py-1 hover:bg-slate-900/50 transition-colors">
                  <span className="text-slate-800 w-8 shrink-0">{i+1}</span>
                  <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-rose-400' : log.includes('AI_MSG') ? 'text-indigo-400 italic' : 'text-slate-400'}>
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
                className="group relative overflow-hidden py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_8px_0_rgb(55,48,163)] active:translate-y-1 active:shadow-none disabled:opacity-30 disabled:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                   <i className="fas fa-heartbeat"></i> Trigger Hartslag
                </span>
              </button>
              <button 
                onClick={() => executeSystemCommand('check-welfare')}
                disabled={isExecuting || !isLive}
                className="group relative overflow-hidden py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_8px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none disabled:opacity-30 disabled:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                   <i className="fas fa-biohazard"></i> Trigger Noodgeval
                </span>
              </button>
            </div>
          </section>

          <GuidePanel cloudUrl={settings.cloudUrl} />
        </div>

        <div className="xl:col-span-4 space-y-8">
          <SettingsPanel settings={settings} onUpdate={(s) => setSettings(s)} />
          
          <section className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
              <i className="fas fa-notes-medical"></i> Zorg-Integratie
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <div className="flex items-center gap-3">
                   <i className="fas fa-sync-alt text-indigo-500"></i>
                   <span className="text-[10px] font-black uppercase text-slate-500">Caren.nl Sync</span>
                </div>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   STABLE
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 opacity-60">
                <div className="flex items-center gap-3">
                   <i className="fas fa-ban text-rose-500"></i>
                   <span className="text-[10px] font-black uppercase text-slate-500">Zonnewoud Exclusie</span>
                </div>
                <span className="text-[10px] font-black text-slate-400">ACTIVE</span>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100 mt-2">
                 <p className="text-[9px] font-bold text-indigo-600 leading-tight">
                    <i className="fas fa-info-circle mr-1"></i>
                    Data integriteit is heilig. Er wordt nooit geschreven naar bestaande health-slots in de logs.
                 </p>
              </div>
            </div>
          </section>

          <ArchitectureDiagram />
        </div>
      </div>
      
      <footer className="text-center py-8">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">GuardianSwitch Engine v1.2.0 • Security Architect Edition • {BUILD_ID}</p>
      </footer>
    </div>
  );
};

export default App;
