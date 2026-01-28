
import React from 'react';
import { SystemSettings } from '../types';

interface Props {
  settings: SystemSettings;
  onUpdate: (settings: SystemSettings) => void;
}

const SettingsPanel: React.FC<Props> = ({ settings, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...settings, [name]: value });
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-indigo-50 p-2 rounded-lg">
          <i className="fas fa-sliders-h text-indigo-600"></i>
        </span>
        <h3 className="text-xl font-bold text-slate-900">Configuratie</h3>
      </div>

      <div className="space-y-6 flex-1">
        {/* Tijd Instelling */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Controle Moment</label>
          <div className="relative">
            <i className="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"></i>
            <input
              type="time"
              name="morningCheckTime"
              value={settings.morningCheckTime}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">Het systeem controleert dagelijks op dit tijdstip.</p>
        </div>

        {/* Contact Gegevens */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Noodcontact</label>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
               <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
               <input
                type="text"
                name="contactName"
                value={settings.contactName}
                onChange={handleChange}
                placeholder="Naam contactpersoon"
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                name="contactMethod"
                value={settings.contactMethod}
                onChange={handleChange}
                className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                <option value="Email">📧 E-mail</option>
                <option value="Telegram">✈️ Telegram</option>
                <option value="SMS">💬 SMS</option>
              </select>
              <div className="relative flex-1">
                <i className="fas fa-at absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  name="contactAddress"
                  value={settings.contactAddress}
                  onChange={handleChange}
                  placeholder="E-mail of nummer"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bericht Sjabloon */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Alarm Bericht</label>
          <div className="relative">
            <textarea
              name="alertMessageTemplate"
              value={settings.alertMessageTemplate}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Gemini optimaliseert dit bericht automatisch.</p>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
           <i className="fas fa-check-circle text-xs"></i>
           <span className="text-[10px] font-bold uppercase tracking-wider">Opgeslagen</span>
        </div>
        <i className="fas fa-save text-slate-300"></i>
      </div>
    </section>
  );
};

export default SettingsPanel;
