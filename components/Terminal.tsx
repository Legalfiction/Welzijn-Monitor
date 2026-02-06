import React, { useRef, useEffect } from 'react';

interface Props {
  logs: string[];
}

const Terminal: React.FC<Props> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={scrollRef} className="flex-1 p-10 font-mono text-[13px] overflow-y-auto space-y-3 bg-[#020617] scroll-smooth">
      {logs.length === 0 && (
        <div className="flex items-center gap-3 text-slate-700 animate-pulse font-bold">
          <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
          SYSTEEM_INITIALISATIE_WRECHT...
        </div>
      )}
      {logs.map((log, i) => (
        <div key={i} className="flex gap-8 group py-1.5 border-b border-white/[0.03] last:border-0">
          <span className="text-slate-800 w-10 shrink-0 text-right select-none opacity-40 text-[10px] font-black">{i + 1}</span>
          <span className={`
            leading-relaxed
            ${log.includes('[OK]') ? 'text-emerald-400 font-bold' : 
              log.includes('[ERR]') ? 'text-rose-400 font-black tracking-tight' : 
              log.includes('Feedback:') ? 'text-indigo-300 italic' : 
              'text-slate-500'}
          `}>
            {log}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Terminal;