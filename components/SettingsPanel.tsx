
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

  const updateContact = (id: string, field: keyof EmergencyContact, value: string) => {
    const newContacts = localSettings.contacts.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    handleChange({ ...localSettings, contacts: newContacts });
  };

  const addContact = () => {
    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      method: 'Email',
      address: ''
    };
    handleChange({ ...localSettings, contacts: [...localSettings.contacts, newContact] });
  };

  const removeContact = (id: string) => {
    handleChange({ ...localSettings, contacts: localSettings.contacts.filter(c => c.id !== id) });
  };

  const handleSave = () => {
    setIsSaving(true);
    onUpdate(localSettings);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 800);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-cog text-indigo-600"></i> Systeem Setup
        </h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto mb-6 pr-1">
        {/* NIEUW: Cloud URL Input */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block">Cloud API Basis URL</label>
          <input
            type="url"
            value={localSettings.cloudUrl}
            onChange={(e) => handleChange({ ...localSettings, cloudUrl: e.target.value })}
            placeholder="https://je-app.vercel.app"
            className="w-full bg-white border border-indigo-200 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-700"
          />
          <p className="text-[9px] text-indigo-400 mt-2 leading-tight">Plak hier de link van je Vercel-app om de knoppen te laten werken.</p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Noodcontacten</h4>
          {localSettings.contacts.map((contact, index) => (
            <div key={contact.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative group mb-3">
              <button 
                onClick={() => removeContact(contact.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-rose-500 rounded-full shadow-sm flex items-center justify-center"
              >
                <i className="fas fa-times text-[10px]"></i>
              </button>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                  placeholder="Naam"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold outline-none"
                />
                <div className="flex gap-2">
                  <select
                    value={contact.method}
                    onChange={(e) => updateContact(contact.id, 'method', e.target.value as any)}
                    className="w-1/3 bg-white border border-slate-200 rounded-xl py-2 px-2 text-[10px] font-bold outline-none"
                  >
                    <option value="Email">Email</option>
                    <option value="Telegram">Telegram</option>
                    <option value="SMS">SMS</option>
                  </select>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={(e) => updateContact(contact.id, 'address', e.target.value)}
                    placeholder="Adres"
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={addContact}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            + Contact Toevoegen
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">Check-in Tijd</label>
           <input
             type="time"
             value={localSettings.morningCheckTime}
             onChange={(e) => handleChange({ ...localSettings, morningCheckTime: e.target.value })}
             className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-center font-mono font-bold outline-none"
           />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!hasChanges || isSaving}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${
          hasChanges ? 'bg-indigo-600 text-white active:scale-95' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
        {isSaving ? 'OPSLAAN...' : 'INSTELLINGEN OPSLAAN'}
      </button>
    </section>
  );
};

export default SettingsPanel;
