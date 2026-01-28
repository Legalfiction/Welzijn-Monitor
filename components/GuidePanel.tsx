
import React, { useState, useEffect } from 'react';

interface Props {
  cloudUrl?: string;
}

const GuidePanel: React.FC<Props> = ({ cloudUrl }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  useEffect(() => {
    const base = cloudUrl ? cloudUrl.replace(/\/$/, '') : window.location.origin;
    setWebhookUrl(`${base}/api/heartbeat`);
  }, [cloudUrl]);

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const macroDroidBody = JSON.stringify({ source: "Telefoon-MacroDroid" }, null, 2);

  return (
    <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-8 md:p-12">
        <h2 className="text-slate-900 text-2xl font-black italic tracking-tighter mb-8 flex items-center gap-3 uppercase">
          <i className="fas fa-mobile-screen-button text-indigo-600"></i> MacroDroid Instellen
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stap 1: De Webhook URL</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-indigo-600 font-mono text-[10px] break-all">
                  {webhookUrl}
                </code>
                <button 
                  onClick={() => copyToClipboard(webhookUrl, setCopied)}
                  className={`px-4 rounded-xl font-bold text-[10px] transition-all uppercase ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}
                >
                  {copied ? 'OK' : 'URL'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stap 2: De HTTP Body (Plakken bij 'Inhoud')</p>
              <div className="flex gap-2">
                <pre className="flex-1 bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[10px] overflow-x-auto">
                  {macroDroidBody}
                </pre>
                <button 
                  onClick={() => copyToClipboard(macroDroidBody, setCopiedBody)}
                  className={`px-4 rounded-xl font-bold text-[10px] transition-all uppercase ${copiedBody ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}
                >
                  {copiedBody ? 'OK' : 'BODY'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
              <h4 className="text-xs font-black text-indigo-900 uppercase mb-4 tracking-widest">Configuratie Checklist:</h4>
              <ul className="text-[11px] text-indigo-800 space-y-3 font-medium">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle mt-0.5"></i>
                  <span><b>Methode:</b> Selecteer <span className="bg-indigo-200 px-1 rounded font-bold">POST</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle mt-0.5"></i>
                  <span><b>Content-Type:</b> Moet <span className="italic">application/json</span> zijn</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle mt-0.5"></i>
                  <span><b>Trigger:</b> Toestel ontgrendeld (of elke 60 min)</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
              <p className="text-[10px] text-amber-800 leading-relaxed font-bold italic">
                <i className="fas fa-info-circle mr-1"></i> 
                Let op: De "Laatste Hartslag" op je Chromebook scherm update niet automatisch als je telefoon verbinding maakt. Check je <b>Vercel Logs</b> om de echte activiteit te zien!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
