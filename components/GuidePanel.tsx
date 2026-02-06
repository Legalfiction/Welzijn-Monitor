
import React, { useState, useEffect } from 'react';

interface Props {
  cloudUrl?: string;
}

const GuidePanel: React.FC<Props> = ({ cloudUrl }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const base = cloudUrl ? cloudUrl.replace(/\/$/, '') : window.location.origin;
    setWebhookUrl(`${base}/api/heartbeat`);
  }, [cloudUrl]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white border-4 border-slate-900 rounded-[2.5rem] overflow-hidden shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
      <div className="p-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-slate-900 text-2xl font-black italic tracking-tighter flex items-center gap-4 uppercase">
            <i className="fas fa-network-wired text-indigo-600"></i> API Endpoint Configuratie
          </h2>
          <span className="text-[10px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">V1 Protocol</span>
        </div>

        <div className="space-y-10">
          <div className="p-8 bg-slate-50 rounded-[2rem] border-4 border-slate-900">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Productie Target URL (Kopieer naar MacroDroid)</label>
            <div className="flex flex-col md:flex-row gap-4">
              <code className="flex-1 bg-white border-2 border-slate-900 px-6 py-5 rounded-2xl text-slate-900 font-mono text-sm break-all font-bold">
                {webhookUrl}
              </code>
              <button 
                onClick={() => copyToClipboard(webhookUrl)}
                className={`px-10 py-5 rounded-2xl font-black text-xs transition-all uppercase border-b-4 shadow-lg ${copied ? 'bg-emerald-500 border-emerald-700 text-white' : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'}`}
              >
                {copied ? 'GEKOPIEERD' : 'KOPIEER URL'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-[2rem]">
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-6 border-b-2 border-indigo-200 pb-2">Device Handshake (MacroDroid)</h4>
              <div className="space-y-4 font-bold text-indigo-800/80 font-mono text-xs">
                 <div className="flex justify-between"><span>METHOD:</span> <span className="text-indigo-900">POST</span></div>
                 <div className="flex justify-between"><span>CONTENT:</span> <span className="text-indigo-900">application/json</span></div>
                 <div className="flex justify-between"><span>BODY:</span> <span className="text-indigo-900">{"{\"source\": \"Mobile\"}"}</span></div>
              </div>
            </div>
            
            <div className="flex items-center p-8 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:rotate-12 transition-transform">
                <i className="fas fa-shield-alt text-9xl"></i>
              </div>
              <p className="text-xs font-bold leading-relaxed relative z-10 italic">
                "Elke ontgrendeling van je telefoon die naar deze URL wordt verzonden, wordt door Gemini gepersonaliseerd en via Resend afgeleverd bij Aldo Huizinga."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
