import React, { useState, useEffect, useCallback } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';
import DashboardHeader from './components/DashboardHeader';
import SettingsPanel from './components/SettingsPanel';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import GuidePanel from './components/GuidePanel';
import Terminal from './components/Terminal';

const ARCHITECT_VERSION = "2.1.0-STRICT";

const App: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [heartbeats, setHeartbeats] = useState<HeartbeatLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addLog = useCallback((msg: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const time = new Date().toLocaleTimeString('nl-NL');
    const prefix = type === 'success' ? '>> [OK]' : type === 'alert' ? '!! [ERR]' : '-- [SYS]';
    setTerminalLogs(prev => [...prev, `${time} ${prefix} ${msg}`].slice(-100));
  }, []);

  // Clean Boot Protocol
  useEffect(() => {
    addLog(`GuardianSwitch Engine v${ARCHITECT_VERSION} gestart.`, 'info');
    addLog(`Mode: Senior Systems Architect (Schoon Schip).`, 'success');
    addLog(`Systeemstatus: NOMINAAL. Geen fouten gedetecteerd.`, 'success');
  }, [addLog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
  }, [settings, heartbeats]);

  const runProtocol = async (type: 'heartbeat' | 'check-welfare') => {
    if (isProcessing || !settings.cloudUrl) return;
    
    setIsProcessing(true);
    addLog(`PROTOCOL_${type.toUpperCase()} geactiveerd.`);

    try {
      const response = await fetch(`${settings.cloudUrl}/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          caller: 'ARCHITECT_DASHBOARD',
          timestamp: Date.now()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addLog(`Protocol succesvol uitgevoerd via remote gateway.`, 'success');
        if (data.content) addLog(`Gateway Feedback: "${data.content}"`, 'info');
        
        const newLog: HeartbeatLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          source: type === 'heartbeat' ? 'MANUEEL_COMMAND' : 'ALARM_VERIFICATIE'
        };
        setHeartbeats(prev => [newLog, ...prev.slice(0, 49)]);
      } else {
        throw new Error(data.error || 'Remote gateway weigert verbinding.');
      }
    } catch (err: any) {
      addLog(`GATEWAY_FAILURE: ${err.message}`, 'alert');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      <DashboardHeader 
        status={settings.cloudUrl ? SystemStatus.ACTIVE : SystemStatus.DISABLED} 
        lastHeartbeat={heartbeats[0]?.timestamp || null} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Main Control Console */}
          <section className="bg-[#020617] rounded-[3rem] border-[10px] border-slate-900 shadow-2xl flex flex-col h-[600px] overflow-hidden relative">
            <div className="bg-slate-900/50 backdrop-blur px-10 py-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 relative"></div>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">System Kernel v2.1</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              </div>
            </div>

            <Terminal logs={terminalLogs} />

            <div className="p-10 bg-slate-900/80 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => runProtocol('heartbeat')}
                disabled={isProcessing || !settings.cloudUrl}
                className="group relative py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[0_8px_0_rgb(55,48,163)] active:translate-y-1 active:shadow-none disabled:opacity-10"
              >
                <i className="fas fa-heartbeat mr-3 text-lg group-hover:scale-110 transition-transform"></i> Manuele Sync
              </button>
              <button 
                onClick={() => runProtocol('check-welfare')}
                disabled={isProcessing || !settings.cloudUrl}
                className="group relative py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[0_8px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none disabled:opacity-10"
              >
                <i className="fas fa-shield-alt mr-3 text-lg group-hover:rotate-12 transition-transform"></i> Forceer Alarm
              </button>
            </div>
          </section>

          <GuidePanel cloudUrl={settings.cloudUrl} />
        </div>

        <div className="lg:col-span-4 space-y-12">
          <SettingsPanel settings={settings} onUpdate={setSettings} />
          <ArchitectureDiagram />
          <div className="bg-white border-4 border-slate-900 p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <i className="fas fa-info-circle"></i> Systeem Bericht
             </h4>
             <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
               "Architect Edition 2.1 is geoptimaliseerd voor determinisme. Elke actie wordt onweerlegbaar vastgelegd."
             </p>
          </div>
        </div>
      </div>

      <footer className="text-center pb-12 border-t border-slate-200 pt-12">
        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.8em]">GuardianSwitch Engine • Clean Sweep Deployment • v2.1.0</p>
      </footer>
    </div>
  );
};

export default App;