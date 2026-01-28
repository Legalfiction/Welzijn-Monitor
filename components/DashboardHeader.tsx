
import React from 'react';
import { SystemStatus } from '../types';

interface Props {
  status: SystemStatus;
  lastHeartbeat: number | null;
}

const DashboardHeader: React.FC<Props> = ({ status, lastHeartbeat }) => {
  const getStatusConfig = () => {
    switch (status) {
      case SystemStatus.ACTIVE:
        return { label: 'ACTIEF', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-check-circle' };
      case SystemStatus.WARNING:
        return { label: 'WAARSCHUWING', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'fa-exclamation-triangle' };
      case SystemStatus.ALERT_TRIGGERED:
        return { label: 'ALARM', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'fa-radiation' };
      case SystemStatus.DISABLED:
        return { label: 'UIT', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: 'fa-power-off' };
      default:
        return { label: 'ONBEKEND', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', icon: 'fa-question-circle' };
    }
  };

  const config = getStatusConfig();
  const lastSeenStr = lastHeartbeat ? new Date(lastHeartbeat).toLocaleString('nl-NL') : 'Nooit';

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
          Guardian<span className="text-indigo-600">Switch</span>
        </h1>
        <p className="text-slate-500 text-sm flex items-center gap-2">
          <i className="fas fa-user-shield text-indigo-500"></i> Veiligheidsmonitoring: <span className="text-slate-900 font-medium">Systeem Operator</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${config.bg} ${config.border} shadow-sm`}>
          <i className={`fas ${config.icon} ${config.color} ${status !== SystemStatus.DISABLED ? 'animate-pulse' : ''}`}></i>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none mb-1">Status</p>
            <p className={`text-xs font-bold ${config.color} leading-none`}>{config.label}</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
           <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Laatste Hartslag</p>
           <p className="text-xs font-semibold text-slate-700 mono">{lastSeenStr}</p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
