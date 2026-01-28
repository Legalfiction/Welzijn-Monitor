
import React from 'react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl overflow-hidden">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <i className="fas fa-sitemap text-blue-400"></i> Systeem Architectuur
      </h3>
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
        {/* Source Layer */}
        <div className="flex gap-4 w-full justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 w-32 text-center shadow-lg">
              <i className="fas fa-mobile-alt text-2xl text-blue-400 mb-2"></i>
              <p className="text-xs font-medium">Android Activiteit</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 w-32 text-center shadow-lg">
              <i className="fas fa-laptop-code text-2xl text-purple-400 mb-2"></i>
              <p className="text-xs font-medium">App Hartslag</p>
            </div>
          </div>
        </div>

        {/* Webhook Gateway */}
        <div className="relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-px bg-slate-700"></div>
          <div className="bg-indigo-600/20 p-4 rounded-full border border-indigo-500 text-center w-48 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Webhook Gateway</p>
            <p className="text-[10px] opacity-70">POST /api/heartbeat</p>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-8 w-px bg-slate-700"></div>
        </div>

        {/* Logic Layer */}
        <div className="flex gap-6 items-center">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-600 w-56 text-center shadow-xl relative">
            <div className="absolute -top-3 -right-3 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded">LOGICA ENGINE</div>
            <i className="fas fa-clock text-xl text-yellow-400 mb-3"></i>
            <p className="text-xs font-bold uppercase mb-2">Check @ 09:00</p>
            <div className="text-[10px] text-left bg-slate-900 p-2 rounded border border-slate-700 mono">
              ALS (nu &gt; 09:00) EN (laatst_gezien &lt; vandaag_start) DAN ALARM
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <i className="fas fa-arrow-right text-slate-600"></i>
          </div>

          <div className="bg-red-900/20 p-5 rounded-xl border border-red-500/50 w-56 text-center shadow-xl">
            <i className="fas fa-bullhorn text-xl text-red-500 mb-3"></i>
            <p className="text-xs font-bold uppercase mb-2">Alarm Trigger</p>
            <p className="text-[10px] opacity-80 mb-2 italic">Preventie: Controleert batterij & informeert gebruiker eerst</p>
            <div className="flex justify-center gap-3">
              <i className="fas fa-envelope text-red-400"></i>
              <i className="fab fa-telegram-plane text-red-400"></i>
              <i className="fas fa-sms text-red-400"></i>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 p-3 bg-green-900/10 border border-green-500/30 rounded-lg w-full text-center">
          <p className="text-[10px] text-green-400 flex items-center justify-center gap-2">
            <i className="fas fa-shield-alt"></i> GEEN INHOUD LOGGING: Alleen tijdstippen en systeemstatus worden opgeslagen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
