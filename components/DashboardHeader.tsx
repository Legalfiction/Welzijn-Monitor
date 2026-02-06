import React from 'react';
import { SystemStatus } from '../types';

interface Props {
  status: SystemStatus;
  lastHeartbeat: number | null;
}

const DashboardHeader: React.FC<Props> = ({ status, lastHeartbeat }) => {
  const timeStr = lastHeartbeat ? new Date(lastHeartbeat).toLocaleString('nl-NL') : 'STATUS_OFFLINE';

  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
      <div className="space-y-2">
        <h1 className="text-6xl font-black italic tracking-tighter text-slate-900 flex items-center gap-4">
          Guardian<span className="text-indigo-600">Switch</span>
          <span className="text-[11px] not-italic bg-indigo-600 text-white px-4 py-1.5 rounded-2xl vertical-middle ml-2 tracking-[0.3em] font-black shadow-lg shadow-indigo-200">2.1</span>
        </h1>
        <div className="flex items-center gap-3 pl-1">
          <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Safety Monitoring & Control</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="bg-white px-10 py-5 rounded-[2.5rem] border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-3 tracking-widest">System Health</p>
          <div className="flex items-center gap-4">
            <div className={`w-3.5 h-3.5 rounded-full ${status === SystemStatus.ACTIVE ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`}></div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{status}</span>
          </div>
        </div>
        
        <div className="bg-white px-10 py-5 rounded-[2.5rem] border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-3 tracking-widest">Last Checksum</p>
          <span className="text-sm font-mono font-bold text-slate-900 tracking-tighter">{timeStr}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;