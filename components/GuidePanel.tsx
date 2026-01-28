
import React, { useState, useEffect } from 'react';

const GuidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  useEffect(() => {
    // Gebruik de stabiele Vercel URL, niet de deployment-hash
    setCurrentUrl('https://welzijn-monitor.vercel.app');
  }, []);

  const copyWebhook = () => {
    const webhookUrl = `${currentUrl}/api/heartbeat`;
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <h2 className="text-xl font-black italic tracking-tighter text-slate-900 flex items-center gap-3">
              <i className="fas fa-robot text-indigo-600"></i> Stap 2: Telefoon Koppelen
            </h2>
            
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Gebruik deze EXACTE link in MacroDroid:</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl text-indigo-600 font-mono text-xs break-all">
                  https://welzijn-monitor.vercel.app/api/heartbeat
                </code>
                <button 
                  onClick={copyWebhook}
                  className={`px-6 rounded-xl font-bold text-xs transition-all ${copiedWebhook ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {copiedWebhook ? 'OK!' : 'KOPIEER'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-800 uppercase mb-2">Actie Type</p>
                <p className="text-xs text-slate-500">HTTP Request</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-800 uppercase mb-2">Methode</p>
                <p className="text-xs text-emerald-600 font-bold">POST</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <i className="fas fa-bug absolute bottom-[-20px] right-[-10px] text-white/10 text-9xl"></i>
            <h3 className="text-lg font-bold mb-4">Mocht het niet werken...</h3>
            <ul className="text-xs space-y-4 text-indigo-100 relative z-10">
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">!</span>
                <span>Check in MacroDroid het <strong>"User Log"</strong> (hoofdscherm). Staat daar "HTTP request failed"? Check dan je internet of de URL.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">!</span>
                <span>Zorg dat <strong>POST</strong> is geselecteerd, niet GET.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">!</span>
                <span>Zorg dat de URL geen spaties bevat aan het begin of eind.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
