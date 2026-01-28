
import React, { useState, useEffect } from 'react';

const GuidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  const copyToClipboard = () => {
    const webhookUrl = `${currentUrl}/api/heartbeat`;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: "fa-download",
      title: "1. Installatie",
      desc: "Download 'MacroDroid' of 'Tasker' uit de Google Play Store op je Android telefoon."
    },
    {
      icon: "fa-fingerprint",
      title: "2. De Trigger",
      desc: "Stel een trigger in zoals 'Scherm Ontgrendelen' of 'App geopend' (bijv. WhatsApp)."
    },
    {
      icon: "fa-network-wired",
      title: "3. De Actie",
      desc: "Kies 'HTTP Request' (POST) en plak de Webhook URL die je hieronder vindt."
    },
    {
      icon: "fa-check-double",
      title: "4. Klaar!",
      desc: "Zodra je je telefoon gebruikt, wordt de timer hier automatisch gereset naar nul."
    }
  ];

  return (
    <section className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="bg-indigo-600/20 p-2 rounded-lg">
              <i className="fas fa-magic text-indigo-400"></i>
            </span>
            Snelstart Configuratie
          </h3>
          <p className="text-slate-400 text-sm mt-1">Volg deze 4 stappen om je Android telefoon te koppelen.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <i className={`fas ${step.icon}`}></i>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-2">{step.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            <div className="absolute top-4 right-4 text-2xl font-black text-slate-700/10 select-none">0{idx + 1}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Jouw Persoonlijke Webhook URL</label>
            <p className="text-[11px] text-slate-500 mb-3">Plak deze URL in je Android automatisering-app (MacroDroid/Tasker).</p>
            <div className="flex items-center gap-2">
              <code className="bg-black/40 px-4 py-2 rounded-lg text-indigo-300 text-xs font-mono border border-slate-700/50 break-all">
                {currentUrl}/api/heartbeat
              </code>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                {copied ? 'Gekopieerd!' : 'Kopieer'}
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <i className="fas fa-qrcode text-4xl text-slate-700"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
