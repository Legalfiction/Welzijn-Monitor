
import React from 'react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm overflow-hidden">
      <h3 className="text-lg font-black italic tracking-tighter mb-8 flex items-center gap-3 text-slate-900 uppercase">
        <i className="fas fa-sitemap text-indigo-600"></i> Hoe het werkt
      </h3>
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        
        <div className="flex gap-6 w-full justify-around">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-40 text-center shadow-sm">
            <i className="fas fa-mobile-alt text-2xl text-indigo-600 mb-2"></i>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Je Telefoon</p>
            <p className="text-[9px] text-slate-400 mt-1">MacroDroid Trigger</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl w-40 text-center shadow-sm">
            <i className="fas fa-globe text-2xl text-indigo-600 mb-2"></i>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Cloud API</p>
            <p className="text-[9px] text-indigo-400 mt-1">Vercel Backend</p>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="w-px h-10 bg-slate-200"></div>
          {/* Box is nu wit/licht ipv zwart */}
          <div className="bg-white p-5 rounded-2xl text-center w-64 shadow-lg border border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">Guardian Engine</p>
            <div className="text-[10px] text-left bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-slate-600 leading-relaxed">
              CHECK: last_signal<br/>
              IF (time &gt; check_time)<br/>
              &amp; ALERT_NOT_SENT<br/>
              THEN TRIGGER_SOS()
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200"></div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1 bg-rose-50 p-5 rounded-2xl border border-rose-100 text-center shadow-sm">
            <p className="text-[10px] font-black uppercase text-rose-600 mb-3 tracking-widest">Nood Protocol</p>
            <div className="flex justify-center gap-4 text-rose-400 text-lg">
              <i className="fas fa-envelope"></i>
              <i className="fab fa-telegram"></i>
              <i className="fas fa-sms"></i>
            </div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl w-full text-center">
          <p className="text-[10px] text-emerald-700 flex items-center justify-center gap-2 font-black uppercase tracking-widest">
            <i className="fas fa-shield-alt"></i> Veilige Privacy-First Verbinding
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
