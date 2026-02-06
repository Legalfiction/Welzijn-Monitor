
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

  // Sync local state if settings prop changes externally
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
          <i className="fas fa-users-cog text-indigo-600"></i> Noodcontacten
        </h3>
        {hasChanges && !isSaving && (
          <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
            WIJZIGINGEN NIET OPGESLAGEN
          </span>
        )}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto mb-6 pr-1">
        {localSettings.contacts.map((contact, index) => (
          <div key={contact.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative group animate-in fade-in slide-in-from-right-2">
            <button 
              onClick={() => removeContact(contact.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-rose-500 rounded-full shadow-sm hover:bg-rose-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <i className="fas fa-times text-[10px]"></i>
            </button>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Naam Contact {index + 1}</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                  placeholder="Bijv. Jan Janssen"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Methode</label>
                  <select
                    value={contact.method}
                    onChange={(e) => updateContact(contact.id, 'method', e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none h-[38px]"
                  >
                    <option value="Email">Email</option>
                    <option value="Telegram">Telegram</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Adres / Nummer</label>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={(e) => updateContact(contact.id, 'address', e.target.value)}
                    placeholder={contact.method === 'Email' ? 'adres@mail.com' : 'Nummer of ID'}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addContact}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-xs font-bold flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus-circle"></i> EXTRA CONTACT TOEVOEGEN
        </button>

        <div className="pt-4 border-t border-slate-100">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">Dagelijkse Check-in Tijd</label>
           <input
             type="time"
             value={localSettings.morningCheckTime}
             onChange={(e) => handleChange({ ...localSettings, morningCheckTime: e.target.value })}
             className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-center font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
           />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!hasChanges || isSaving}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${
          hasChanges 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        {isSaving ? (
          <><i className="fas fa-spinner animate-spin"></i> OPSLAAN...</>
        ) : (
          <><i className="fas fa-save"></i> Instellingen Opslaan</>
        )}
      </button>
    </section>
  );
};

export default SettingsPanel;
