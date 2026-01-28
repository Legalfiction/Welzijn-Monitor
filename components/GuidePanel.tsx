
import React, { useState, useEffect } from 'react';

const GuidePanel: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Genereert de URL op basis van waar je NU bent
    setWebhookUrl(`${window.location.origin}/api/heartbeat`);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 md:p-12">
        <h2 className="text-white text-2xl font-black italic tracking-tighter mb-8 flex items-center gap-3">
          <i className="fas fa-mobile-screen-button text-indigo-500"></i> CONFIGURATIE VOOR ANDROID
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Stap 1: De URL voor MacroDroid</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-black/50 border border-white/10 px-4 py-3 rounded-xl text-indigo-400 font-mono text-xs break-all">
                  {webhookUrl || 'Laden...'}
                </code>
                <button 
                  onClick={handleCopy}
                  className={`px-6 rounded-xl font-bold text-xs transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}
                >
                  {copied ? 'GEKOPIEERD' : 'KOPIEER'}
                </button>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stap 2: MacroDroid Instellingen</p>
              <ul className="text-xs text-slate-300 space-y-3">
                <li className="flex gap-3">
                  <b className="text-indigo-400">Trigger:</b> <span>Toestel ontgrendeld</span>
                </li>
                <li className="flex gap-3">
                  <b className="text-indigo-400">Actie:</b> <span>HTTP-aanvraag (HTTP Request)</span>
                </li>
                <li className="flex gap-3">
                  <b className="text-indigo-400">Methode:</b> <span className="underline decoration-indigo-500 font-bold">POST</span>
                </li>
                <li className="flex gap-3">
                  <b className="text-indigo-400">Content:</b> <span>Geen (mag leeg blijven)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl">
            <h3 className="text-rose-400 font-bold text-sm mb-4 flex items-center gap-2">
              <i className="fas fa-triangle-exclamation"></i> Waarom zie je niets in de logs?
            </h3>
            <div className="space-y-4 text-xs text-rose-200/70">
              <p>
                1. <b>Batterijbesparing:</b> Ga naar je Android Instellingen > Apps > MacroDroid > Batterij. Zet deze op <b>"Onbeperkt"</b>. Anders weigert Android de verbinding op de achtergrond.
              </p>
              <p>
                2. <b>Vercel Filters:</b> In je Vercel Dashboard staan de logs vaak gefilterd. Klik op de <b>X</b> in de zoekbalk om ALLES te zien.
              </p>
              <p>
                3. <b>MacroDroid Log:</b> Kijk in de MacroDroid app bij "User Log". Zie je daar rode tekst? Dan blokkeert je telefoon de uitgaande verbinding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
