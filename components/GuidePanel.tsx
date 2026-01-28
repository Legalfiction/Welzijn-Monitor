
import React, { useState, useEffect } from 'react';

const GuidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'vercel'>('vercel');

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  const copyWebhook = () => {
    const webhookUrl = `${currentUrl}/api/heartbeat`;
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800">
          <i className="fas fa-terminal text-indigo-500"></i> INSTALLATIE PROTOCOL
        </h2>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-400"></div>
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        </div>
      </div>
      
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button 
          onClick={() => setActiveTab('vercel')}
          className={`flex-1 py-4 px-6 text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'vercel' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-rocket"></i> STAP 1: VERCEL ACTIVEREN
        </button>
        <button 
          onClick={() => setActiveTab('android')}
          className={`flex-1 py-4 px-6 text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'android' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-mobile-alt"></i> STAP 2: TELEFOON KOPPELEN
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'vercel' ? (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-4">
              <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <i className="fas fa-power-off"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">Bijna klaar! Laatste actie in Vercel:</p>
                <p className="text-xs text-indigo-700">Je hebt de sleutel opgeslagen, nu moeten we de server herstarten.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                <p className="text-xs text-slate-600">Klik in Vercel helemaal bovenaan op de naam van je project: <strong>welzijn-monitor</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                <p className="text-xs text-slate-600">Klik in het menu dat nu verschijnt op de tab <strong>Deployments</strong> (naast Overview en Activity).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                <p className="text-xs text-slate-600">Klik bij de bovenste rij op de <strong>drie puntjes (...)</strong> en kies <strong>Redeploy</strong>.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] text-slate-500 ml-2">VERCEL DEPLOYMENT MANAGER</span>
              </div>
              <div className="text-[11px] text-slate-300">
                <div className="flex justify-between border-b border-slate-800 py-2">
                  <span>[TAB] OVERVIEW</span>
                  <span>[TAB] ACTIVITY</span>
                  <span className="text-indigo-400 font-bold underline underline-offset-4">[TAB] DEPLOYMENTS</span>
                </div>
                <div className="py-3 text-slate-500">
                  Selecteer bovenste item -> Klik ... -> <span className="text-white font-bold">REDEPLOY</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-4">
               <i className="fas fa-arrow-down text-indigo-300 animate-bounce"></i>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
              <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 block">
                Webhook URL voor MacroDroid
              </label>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 bg-white px-4 py-2 rounded-lg text-indigo-600 text-[11px] font-mono border border-indigo-200 break-all select-all shadow-sm">
                  {currentUrl}/api/heartbeat
                </code>
                <button 
                  onClick={copyWebhook}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs transition-all ${copiedWebhook ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'}`}
                >
                  <i className={`fas ${copiedWebhook ? 'fa-check' : 'fa-copy'}`}></i>
                  {copiedWebhook ? 'OK' : 'Kopieer'}
                </button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <h4 className="text-xs font-bold text-slate-800 mb-2">Hoe stel je dit in?</h4>
               <ul className="text-[11px] text-slate-600 space-y-2">
                 <li><i className="fas fa-chevron-right text-indigo-400 mr-2"></i> Open MacroDroid op je Android telefoon.</li>
                 <li><i className="fas fa-chevron-right text-indigo-400 mr-2"></i> Maak een macro: Trigger = Toestel Ontgrendeld.</li>
                 <li><i className="fas fa-chevron-right text-indigo-400 mr-2"></i> Actie = HTTP Request (POST).</li>
                 <li><i className="fas fa-chevron-right text-indigo-400 mr-2"></i> Plak bovenstaande URL in het veld 'URL'.</li>
               </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GuidePanel;
