
import React, { useState, useEffect } from 'react';
import { SystemSettings, EmergencyContact } from '../types';

interface Props {
  settings: SystemSettings;
  onUpdate: (settings: SystemSettings) => void;
}

const SettingsPanel: React.FC<Props> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (newSettings: SystemSettings) => {
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    onUpdate(localSettings);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 800);
  };

  const isUrlValid = localSettings.cloudUrl.startsWith('https://');

  return (
    <section className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase italic tracking-tighter">
          <i className="fas fa-bolt text-indigo-600"></i> Live Activatie
        </h3>
        {isUrlValid && (
          <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full animate-pulse">MONITORING</span>
        )}
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto mb-8 pr-2">
        <div className={`p-6 rounded-3xl border-4 transition-all ${isUrlValid ? 'bg-emerald-50 border-emerald-500' : 'bg-amber-50 border-amber-400'}`}>
          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Cloud API Basis URL</label>
          <input
            type="url"
            value={localSettings.cloudUrl}
            onChange={(e) => handleChange({ ...localSettings, cloudUrl: e.target.value })}
            placeholder="https://jouw-project.vercel.app"
            className="w-full bg-white border-2 border-slate-900 rounded-xl py-3 px-4 text-xs font-bold focus:ring-4 focus:ring-indigo-200 outline-none text-slate-900 shadow-inner"
          />
          <p className="text-[10px] text-slate-600 mt-3 leading-tight font-medium">
            {isUrlValid ? "✅ Elke ontgrendeling triggert nu direct een mail naar Aldo." : "⚠️ Voer je URL in om de live koppeling te starten."}
          </p>
        </div>

        <div className="pt-6 border-t-2 border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Actieve Ontvanger</h4>
          <div className="p-5 bg-slate-900 rounded-3xl border-2 border-slate-800">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-black">AH</div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400">Aldo Huizinga</p>
                <p className="text-[11px] font-mono opacity-60">aldo.huizinga@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Systeem Protocol</p>
           <p className="text-[11px] text-slate-600 font-bold italic">"Bij elke ontgrendeling: Genereer tekst via Gemini en stuur direct mail via Resend."</p>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!hasChanges || isSaving}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl border-4 border-slate-900 ${
          hasChanges ? 'bg-indigo-600 text-white active:translate-y-1' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
        <span>SLA CONFIGURATIE OP</span>
      </button>
    </section>
  );
};

export default SettingsPanel;
