import React, { useState } from 'react';
import { SystemSettings } from '../types';

interface Props {
  settings: SystemSettings;
  onUpdate: (s: SystemSettings) => void;
}

const SettingsPanel: React.FC<Props> = ({ settings, onUpdate }) => {
  const [url, setUrl] = useState(settings.cloudUrl);

  const handleSave = () => {
    onUpdate({ ...settings, cloudUrl: url });
  };

  return (
    <section className="bg-white border-[6px] border-slate-900 rounded-[3rem] p-12 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
        <i className="fas fa-shield-alt text-[15rem] text-slate-900"></i>
      </div>
      
      <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 flex items-center gap-4">
        <i className="fas fa-microchip text-indigo-600"></i> Logic Config
      </h3>
      
      <div className="space-y-10 relative z-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-500 block tracking-[0.2em]">Target Infrastructure URL</label>
          <div className="relative">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 border-4 border-slate-900 rounded-[2rem] px-8 py-5 text-xs font-mono font-bold focus:bg-white outline-none transition-all placeholder:text-slate-300"
              placeholder="https://deploy.vercel.app"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
               <i className="fas fa-server"></i>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 rounded-[2.5rem] border-2 border-slate-800 shadow-inner">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/40">
              <i className="fas fa-user-check text-2xl"></i>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-indigo-400 mb-1 tracking-widest leading-none">Primary Guardian</p>
              <p className="text-md font-black text-white leading-tight">{settings.contacts[0].name}</p>
              <p className="text-[10px] mono text-slate-500 mt-1 uppercase">{settings.contacts[0].email}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] transition-all shadow-[0_8px_0_rgb(31,41,55)] active:translate-y-2 active:shadow-none"
        >
          Opslaan & Synchroniseren
        </button>
      </div>
    </section>
  );
};

export default SettingsPanel;