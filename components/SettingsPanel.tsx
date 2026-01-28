
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
    <section className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-slate-800 p-2 rounded-lg">
          <i className="fas fa-sliders-h text-indigo-400"></i>
        </span>
        <h3 className="text-xl font-bold text-white">Configuratie</h3>
      </div>

      <div className="space-y-8 flex-1">
        {/* Tijd Instelling */}
        <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Controle Moment</label>
          <div className="relative">
            <i className="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"></i>
            <input
              type="time"
              name="morningCheckTime"
              value={settings.morningCheckTime}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">Het systeem controleert elke ochtend om deze tijd of je je telefoon al hebt gebruikt.</p>
        </div>

        {/* Contact Gegevens */}
        <div className="space-y-5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Noodcontact</label>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
               <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
               <input
                type="text"
                name="contactName"
                value={settings.contactName}
                onChange={handleChange}
                placeholder="Naam contactpersoon"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                name="contactMethod"
                value={settings.contactMethod}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                <option value="Email">📧 E-mail</option>
                <option value="Telegram">✈️ Telegram</option>
                <option value="SMS">💬 SMS</option>
              </select>
              <div className="relative flex-1">
                <i className="fas fa-at absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                <input
                  type="text"
                  name="contactAddress"
                  value={settings.contactAddress}
                  onChange={handleChange}
                  placeholder="E-mail of nummer"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bericht Sjabloon */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Alarm Bericht</label>
          <div className="relative">
            <textarea
              name="alertMessageTemplate"
              value={settings.alertMessageTemplate}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
              placeholder="Wat moet er in het bericht staan?"
            />
            <div className="absolute bottom-3 right-3">
              <i className="fas fa-pen-nib text-slate-700 text-xs"></i>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 mt-2">Gemini AI zal dit bericht optimaliseren voor verzending op basis van de context.</p>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-500">
           <i className="fas fa-shield-check text-xs"></i>
           <span className="text-[10px] font-bold uppercase tracking-wider">Instellingen opgeslagen</span>
        </div>
        <i className="fas fa-save text-slate-700"></i>
      </div>
    </section>
  );
};

export default SettingsPanel;
