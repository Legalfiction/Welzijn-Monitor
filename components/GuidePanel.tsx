
import React, { useState, useEffect } from 'react';

const GuidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'vercel'>('vercel');

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  const copyToClipboard = () => {
    const webhookUrl = `${currentUrl}/api/heartbeat`;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const androidSteps = [
    { icon: "fa-download", title: "Installatie", desc: "Download 'MacroDroid' in de Play Store." },
    { icon: "fa-fingerprint", title: "Trigger", desc: "Kies 'Toestel Ontgrendeld' als trigger." },
    { icon: "fa-network-wired", title: "Actie", desc: "Kies 'HTTP Request' (POST) met de URL hieronder." },
    { icon: "fa-check-double", title: "Check", desc: "Ontgrendel je telefoon om de verbinding te testen." }
  ];

  const vercelSteps = [
    { icon: "fa-cloud-upload-alt", title: "Koppel GitHub", desc: "Ga naar Vercel.com en kies je 'Welzijn-Monitor' repo." },
    { icon: "fa-key", title: "API Sleutel", desc: "Voeg 'API_KEY' toe bij Environment Variables." },
    { icon: "fa-rocket", title: "Deploy", desc: "Druk op 'Deploy' en je app krijgt een publieke URL." },
    { icon: "fa-link", title: "Webhook", desc: "Gebruik de nieuwe URL in MacroDroid." }
  ];

  return (
    <section className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl transition-all">
      <div className="flex border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('vercel')}
          className={`flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'vercel' ? 'bg-indigo-600 text-white shadow-inner' : 'text-slate-400 hover:text-slate-200 bg-slate-800/20'}`}
        >
          <i className="fas fa-cloud-upload-alt"></i> 1. Vercel Setup
        </button>
        <button 
          onClick={() => setActiveTab('android')}
          className={`flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'android' ? 'bg-indigo-600 text-white shadow-inner' : 'text-slate-400 hover:text-slate-200 bg-slate-800/20'}`}
        >
          <i className="fas fa-mobile-alt"></i> 2. Android Koppelen
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(activeTab === 'android' ? androidSteps : vercelSteps).map((step, idx) => (
            <div key={idx} className="relative group p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">{step.title}</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">{step.desc}</p>
              <div className="absolute top-3 right-3 text-xl font-black text-slate-700/10">0{idx + 1}</div>
            </div>
          ))}
        </div>
        
        <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 block">
                {activeTab === 'android' ? 'Jouw Webhook Eindpunt' : 'Vercel Omgevingsvariabele'}
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                {activeTab === 'android' 
                  ? 'Plak dit in de HTTP POST actie van je Android app.' 
                  : 'Naam: API_KEY | Waarde: Jouw Gemini Key.'}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/40 px-4 py-2 rounded-lg text-indigo-300 text-[11px] font-mono border border-slate-700/50 break-all select-all">
                  {activeTab === 'android' ? `${currentUrl}/api/heartbeat` : 'API_KEY'}
                </code>
                {activeTab === 'android' && (
                  <button 
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                  >
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    {copied ? 'Gekopieerd!' : 'Kopieer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
