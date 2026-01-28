
import React, { useState, useEffect, useCallback } from 'react';
import { SystemStatus, SystemSettings, HeartbeatLog, AlertLog } from './types.ts';
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(heartbeats));
  }, [heartbeats]);

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
  };

  const testServerConnection = async () => {
    if (isPinging) return;
    
    console.log("🚀 START VERBINDINGSTEST");
    setIsPinging(true);
    setPingStatus('idle');
    setServerFeedback(null);

    // Harde reset na 10 seconden, ongeacht wat fetch doet
    const hardResetTimeout = setTimeout(() => {
      console.error("🛑 HARDE RESET: Knop draaide te lang, forceer stop.");
      setIsPinging(false);
      setPingStatus('error');
      setServerFeedback("Fout: Server reageert helemaal niet.");
    }, 10000);

    try {
      // Gebruik absolute URL om verwarring in preview environments te voorkomen
      const apiUrl = `${window.location.origin}/api/heartbeat`;
      console.log("🔗 Verbinding maken met:", apiUrl);

      const response = await fetch(apiUrl, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          source: 'Manual Test',
          browser: navigator.userAgent.substring(0, 50)
        })
      });
      
      console.log("📡 Status ontvangen:", response.status);
      
      const text = await response.text();
      console.log("📝 Server antwoord (raw):", text);

      if (response.ok) {
        let data;
        try {
          data = JSON.parse(text);
          setPingStatus('success');
          setServerFeedback(`GELUKT! Server tijd: ${data.serverTime}`);
          
          const newLog: HeartbeatLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            source: 'Browser Test'
          };
          setHeartbeats(prev => [newLog, ...prev.slice(0, 14)]);
        } catch (parseError) {
          console.error("❌ Kan JSON niet lezen:", text);
          setPingStatus('error');
          setServerFeedback("Fout: Server stuurde geen geldige JSON");
        }
      } else {
        setPingStatus('error');
        setServerFeedback(`Server Fout: ${response.status}`);
      }
    } catch (err: any) {
      console.error("🚨 Netwerkfout:", err);
      setPingStatus('error');
      setServerFeedback(`Verbindingsfout: ${err.message || 'Onbekend'}`);
    } finally {
      clearTimeout(hardResetTimeout);
      setIsPinging(false);
      console.log("🏁 TEST AFGEROND");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 safe-padding text-slate-900">
      <DashboardHeader 
        status={SystemStatus.ACTIVE} 
        lastHeartbeat={heartbeats[0]?.timestamp || null} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter">VERBINDINGSTEST</h2>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Controleer de Cloud verbinding</p>
              </div>
              <button 
                onClick={() => window.open('https://vercel.com/aldohuizinga-gmailcoms-projects/welzijn-monitor/logs', '_blank')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <i className="fas fa-terminal"></i> OPEN LIVE LOGS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                <p className="text-[11px] text-slate-600 mb-6 leading-relaxed">
                  Druk op de knop om te zien of je browser contact kan maken met de Vercel API.
                </p>
                <button 
                  onClick={testServerConnection}
                  disabled={isPinging}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm ${
                    pingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                    pingStatus === 'error' ? 'bg-rose-500 text-white' :
                    'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  {isPinging ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bolt"></i>}
                  {isPinging ? 'VERZENDEN...' : pingStatus === 'success' ? 'CLOUD BEREIKT!' : pingStatus === 'error' ? 'FOUT - OPNIEUW' : 'STUUR TEST-SIGNAAL'}
                </button>
                {serverFeedback && (
                  <p className={`mt-3 text-[10px] font-bold text-center ${pingStatus === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {serverFeedback}
                  </p>
                )}
              </div>

              <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4">LOGS NIET ZICHTBAAR?</h4>
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                  Als de knop groen wordt maar de logs zijn leeg, check dan of je in het juiste Vercel project kijkt en of er geen filters aan staan.
                </p>
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
