
import React, { useState, useEffect, useRef } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog } from './types.ts';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.ts';
import DashboardHeader from './components/DashboardHeader.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ArchitectureDiagram from './components/ArchitectureDiagram.tsx';
import GuidePanel from './components/GuidePanel.tsx';

const BUILD_ID = "VERSIE_FEB_2025_RESEND_FIX";

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

  const isLive = settings.cloudUrl && settings.cloudUrl.includes('vercel.app');

  const addLog = (msg: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const time = new Date().toLocaleTimeString('nl-NL');
    const prefix = type === 'success' ? '>>> SUCCESS:' : type === 'alert' ? '!!! ERROR:' : '--- SYSTEM:';
    setTerminalLogs(prev => [...prev, `${time} ${prefix} ${msg}`].slice(-100));
  };

  useEffect(() => {
    if (isLive) {
      addLog(`STATUS: Verbonden met Productie Server op ${settings.cloudUrl}`, 'success');
    } else {
      addLog("WAARSCHUWING: Geen geldige Vercel URL geconfigureerd.", 'alert');
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
    addLog(`START_COMMUNICATIE: Verzoek naar ${apiUrl}`);

    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'DASHBOARD_OVERRIDE' }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addLog(`SERVER_CONFIRMED: Mail afgeleverd bij server-queue.`, 'success');
        addLog(`MESSAGE_PAYLOAD: ${data.content}`, 'info');
        
        const now = Date.now();
        setHeartbeats(prev => [{ 
          id: now.toString(), 
          timestamp: now, 
          source: command === 'heartbeat' ? 'HANDMATIG' : 'NOODGEVAL' 
        }, ...prev.slice(0, 24)]);
      } else {
        addLog(`FOUT_MELDING: ${data.error}`, 'alert');
      }
    } catch (err: any) {
      addLog(`NETWERK_FOUT: Kan server niet bereiken. Check of de URL exact klopt.`, 'alert');
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
                  <i className="fas fa-exclamation-triangle text-6xl text-rose-500 animate-bounce"></i>
                  <h3 className="text-white text-2xl font-black uppercase italic tracking-tighter">Systeem Geblokkeerd</h3>
                  <p className="text-slate-400 font-bold text-sm">De Cloud API Basis URL ontbreekt of is onjuist. Vul je Vercel-link in bij instellingen om het systeem te activeren.</p>
                </div>
              </div>
            )}
            
            <div className="bg-slate-900 px-10 py-6 border-b border-slate-800 flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Live Production Stream</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
            </div>

            <div className="flex-1 p-10 font-mono text-[13px] overflow-y-auto space-y-2">
              {terminalLogs.length === 0 && <p className="text-slate-700 italic">Systeem start op...</p>}
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-slate-900/50 py-1">
                  <span className="text-slate-800 w-8 shrink-0">{i+1}</span>
                  <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-rose-400' : 'text-slate-400'}>
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
                className="py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 border-b-4 border-indigo-800 disabled:opacity-30"
              >
                Trigger Hartslag
              </button>
              <button 
                onClick={() => executeSystemCommand('check-welfare')}
                disabled={isExecuting || !isLive}
                className="py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 border-b-4 border-rose-800 disabled:opacity-30"
              >
                Trigger Noodgeval
              </button>
            </div>
          </section>

          <GuidePanel cloudUrl={settings.cloudUrl} />
        </div>

        <div className="xl:col-span-4 space-y-8">
          <SettingsPanel settings={settings} onUpdate={(s) => setSettings(s)} />
          
          <section className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-10 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
              <i className="fas fa-stethoscope"></i> Systeem Diagnose
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-500">MacroDroid Sync</span>
                <span className={`text-[10px] font-black ${isLive ? 'text-emerald-500' : 'text-rose-500'}`}>{isLive ? 'CONNECTED' : 'WAITING'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-500">Build Tag</span>
                <span className="text-[10px] font-black text-slate-400">{BUILD_ID}</span>
              </div>
            </div>
          </section>

          <ArchitectureDiagram />
        </div>
      </div>
      
      <footer className="text-center py-8">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">GuardianSwitch Engine v1.1.0 • Build: {BUILD_ID}</p>
      </footer>
    </div>
  );
};

export default App;
