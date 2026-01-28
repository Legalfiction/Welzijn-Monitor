
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

  const handleCopy = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-8 md:p-12">
        <h2 className="text-slate-900 text-2xl font-black italic tracking-tighter mb-8 flex items-center gap-3">
          <i className="fas fa-mobile-screen-button text-indigo-600"></i> CONFIGURATIE VOOR ANDROID
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">De URL voor MacroDroid</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-indigo-600 font-mono text-[10px] break-all">
                  {webhookUrl}
                </code>
                <button 
                  onClick={handleCopy}
                  className={`px-6 rounded-xl font-bold text-[10px] transition-all uppercase tracking-widest ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white active:scale-95'}`}
                >
                  {copied ? 'OK' : 'KOPIEER'}
                </button>
              </div>
              {!cloudUrl && (
                <p className="text-[9px] text-rose-500 font-bold italic">⚠️ Let op: Vul eerst je Vercel URL in bij instellingen!</p>
              )}
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MacroDroid Checklist</p>
              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li>• Trigger: <b>Toestel ontgrendeld</b></li>
                <li>• Actie: <b>HTTP-aanvraag</b></li>
                <li>• Methode: <b className="text-indigo-600">POST</b></li>
                <li>• Plak de URL hierboven in het veld</li>
              </ul>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl">
            <h3 className="text-rose-600 font-bold text-sm mb-4 flex items-center gap-2">
              <i className="fas fa-shield-halved"></i> Belangrijke Tip
            </h3>
            <p className="text-[11px] text-rose-800/80 leading-relaxed mb-4">
              Omdat je de app in de "Preview" mode gebruikt, kan je browser de test blokkeren. Als dat gebeurt, kopieer dan de URL uit de instellingen en plak deze direct in je browser-adresbalk om te zien of de API reageert.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePanel;
