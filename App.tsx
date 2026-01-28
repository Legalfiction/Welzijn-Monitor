
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
  const [debugLogs, setDebugLogs] = useState<string[]>(["Systeem online. Test-modus: Elke hartslag stuurt een 'mail'."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const isPreview = window.location.href.includes('googleusercontent.com') || window.location.href.includes('aistudio.google.com');

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, `[${time}] ${msg}`].slice(-15));
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debugLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const testServerConnection = async () => {
    if (isPinging) return;
    
    const baseApi = settings.cloudUrl ? settings.cloudUrl.replace(/\/$/, '') : window.location.origin;
    const apiUrl = `${baseApi}/api/heartbeat`;

    if (isPreview && !settings.cloudUrl) {
      addLog("⚠️ WAARSCHUWING: Vul eerst je Vercel URL in!");
      setPingStatus('error');
      return;
    }

    setIsPinging(true);
    setPingStatus('idle');
    addLog(`🚀 Test-signaal sturen naar Cloud...`);

    try {
      const response = await fetch(apiUrl, { 
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'Telefoon-MacroDroid', type: 'Test' }), // We simuleren een telefoon-bron
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPingStatus('success');
        addLog("✅ CLOUD ONTVANGEN!");
        if (data.simulated_message) {
          addLog(`📧 MAIL GENERATIE: "${data.simulated_message.substring(0, 40)}..."`);
          addLog("ℹ️ Check je Vercel logs voor de volledige 'verzonden' email.");
        }
        const now = Date.now();
        setHeartbeats(prev => [{ id: now.toString(), timestamp: now, source: 'Cloud + Mail Test' }, ...prev.slice(0, 14)]);
      } else {
        setPingStatus('error');
        addLog(`❌ FOUT: ${response.status}`);
      }
    } catch (err: any) {
      setPingStatus('error');
      addLog(`🚨 ERROR: ${err.message}`);
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
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Test-Modus Actief
              </span>
            </div>
            
            <h2 className="text-2xl font-black italic tracking-tighter mb-8 uppercase">Live Test Terminal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <button 
                  onClick={testServerConnection}
                  disabled={isPinging}
                  className={`w-full py-8 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 shadow-lg ${
                    pingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                    pingStatus === 'error' ? 'bg-rose-500 text-white' :
                    'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  <i className="fas fa-paper-plane text-xl"></i>
                  <span>{isPinging ? 'VERWERKEN...' : 'SIMULEER TELEFOON SIGNAAL'}</span>
                  <span className="text-[9px] opacity-60 font-medium">(Triggert Gemini & Mail Log)</span>
                </button>
                
                <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-inner">
                   <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Systeem Console</span>
                   </div>
                  <div className="font-mono text-[10px] space-y-1.5 h-48 overflow-y-auto text-slate-400">
                    {debugLogs.map((log, i) => (
                      <div key={i} className={`${log.includes('✅') ? 'text-emerald-400' : log.includes('🚨') ? 'text-rose-400' : ''}`}>
                        {log}
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border-2 border-indigo-100 p-6 rounded-[2rem] shadow-sm">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 italic">Test Instructie</h4>
                  <ol className="text-xs text-slate-600 space-y-4 font-medium">
                    <li className="flex gap-3">
                      <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                      <span>Druk op de blauwe knop hiernaast om een <b>telefoon-unlock</b> na te bootsen.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                      <span>Wacht op de bevestiging van de Cloud.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                      <span>Bekijk je <b>Vercel Logs</b> om de "verzonden" email van Gemini te lezen!</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem]">
                  <p className="text-[10px] text-emerald-800 leading-relaxed font-bold italic flex items-start gap-3">
                    <i className="fas fa-magic mt-1"></i>
                    <span>In deze test-fase schrijft Gemini voor elke hartslag een uniek bericht om aan te tonen dat de verbinding werkt.</span>
                  </p>
                </div>
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
