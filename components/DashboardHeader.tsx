
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
        return { label: 'ACTIEF', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50', icon: 'fa-check-circle' };
      case SystemStatus.WARNING:
        return { label: 'WAARSCHUWING', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', icon: 'fa-exclamation-triangle' };
      case SystemStatus.ALERT_TRIGGERED:
        return { label: 'ALARM GEACTIVEERD', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50', icon: 'fa-radiation' };
      case SystemStatus.DISABLED:
        return { label: 'UITGESCHAKELD', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/50', icon: 'fa-power-off' };
      default:
        return { label: 'ONBEKEND', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/50', icon: 'fa-question-circle' };
    }
  };

  const config = getStatusConfig();
  const lastSeenStr = lastHeartbeat ? new Date(lastHeartbeat).toLocaleString('nl-NL') : 'Nooit';

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
          Guardian<span className="text-indigo-500">Switch</span>
        </h1>
        <p className="text-slate-400 text-sm flex items-center gap-2">
          <i className="fas fa-user-shield text-indigo-400"></i> Veiligheidsmonitoring Actief voor: <span className="text-slate-200">Systeem Operator</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${config.bg} ${config.border} shadow-lg`}>
          <i className={`fas ${config.icon} ${config.color} animate-pulse`}></i>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-none mb-1">Systeem Status</p>
            <p className={`text-xs font-bold ${config.color} leading-none`}>{config.label}</p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-xl">
           <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Laatste Hartslag</p>
           <p className="text-xs font-medium text-slate-200 mono">{lastSeenStr}</p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
