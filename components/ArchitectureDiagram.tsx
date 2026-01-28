
import React from 'react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-slate-900">
        <i className="fas fa-sitemap text-indigo-600"></i> Systeem Flow
      </h3>
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        
        <div className="flex gap-6 w-full justify-around">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-36 text-center shadow-sm">
            <i className="fas fa-mobile-alt text-2xl text-indigo-500 mb-2"></i>
            <p className="text-[11px] font-bold text-slate-700">Android Macro</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-36 text-center shadow-sm">
            <i className="fas fa-mouse-pointer text-2xl text-rose-500 mb-2"></i>
            <p className="text-[11px] font-bold text-slate-700">App Klik</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-10 w-px bg-slate-200"></div>
          <div className="bg-indigo-600 p-4 rounded-2xl text-center w-52 shadow-lg border border-indigo-700">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Cloud Gateway</p>
            <p className="text-xs font-mono text-white">/api/heartbeat</p>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-10 w-px bg-slate-200"></div>
        </div>

        <div className="flex gap-8 items-stretch">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 w-60 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Logic Engine</p>
            <div className="text-[11px] text-left bg-white p-3 rounded-xl border border-slate-200 mono text-slate-600 leading-relaxed">
              IF (time &gt; 09:00)<br/>AND (last_log &lt; today)<br/>THEN TRIGGER_ALARM
            </div>
          </div>

          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 w-60 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase text-rose-600 mb-3 tracking-widest">Alarm Output</p>
            <div className="flex justify-center gap-4 text-rose-500 text-lg">
              <i className="fas fa-envelope"></i>
              <i className="fab fa-telegram"></i>
              <i className="fas fa-sms"></i>
            </div>
            <p className="text-[10px] text-rose-400 mt-3 italic">AI-geoptimaliseerd</p>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl w-full text-center">
          <p className="text-[10px] text-emerald-700 flex items-center justify-center gap-2 font-medium">
            <i className="fas fa-shield-alt"></i> PRIVACY-EERST: Alleen tijdstempels worden verwerkt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
