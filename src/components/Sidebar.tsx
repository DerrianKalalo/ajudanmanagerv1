import React from 'react';
import { GameStats } from '../types';
import { Calendar, User, Star, Shield, Activity, Users, Globe, Building } from 'lucide-react';

interface SidebarProps {
  stats: GameStats | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="w-80 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col h-full text-zinc-500 font-mono text-sm justify-center items-center">
        <Activity className="w-8 h-8 mb-4 opacity-50 animate-pulse" />
        <p>MENUNGGU DATA BIROKRASI...</p>
      </div>
    );
  }

  const StatRow = ({ icon: Icon, label, value, colorClass = "text-zinc-100" }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
      <div className="flex items-center gap-3 text-zinc-400">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <span className={`font-mono font-medium ${colorClass}`}>{value}</span>
    </div>
  );

  const getStressColor = (val: number) => {
    if (val > 80) return "text-red-500";
    if (val > 50) return "text-yellow-500";
    return "text-emerald-500";
  };

  const getTrustColor = (val: number) => {
    if (val < 30) return "text-red-500";
    if (val < 60) return "text-yellow-500";
    return "text-emerald-500";
  };

  return (
    <div className="w-80 bg-zinc-950 border-r border-zinc-800 h-full flex flex-col overflow-y-auto hidden md:flex">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
        <h1 className="text-xl font-serif font-bold text-zinc-100 tracking-tight mb-1">Ajudan Manager</h1>
        <p className="text-xs font-mono text-zinc-500">BIROKRASI ENGINE v1.0</p>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        <div>
          <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Waktu & Posisi</h2>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-3 mb-4 text-zinc-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <div className="font-mono text-sm">
                Hari {stats.hari} / Bulan {stats.bulan} / Tahun {stats.tahun}
              </div>
            </div>
            <div className="flex items-start gap-3 text-zinc-300">
              <User className="w-4 h-4 text-emerald-400 mt-0.5" />
              <div className="text-sm font-medium leading-snug">
                {stats.atasan || "Belum Ditugaskan"}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Status Personal</h2>
          <div className="flex flex-col">
            <StatRow icon={Star} label="Reputasi Pribadi" value={`${stats.reputasiPribadi || 0}/100`} />
            <StatRow icon={Shield} label="Kepercayaan Atasan" value={`${stats.kepercayaanAtasan || 0}/100`} colorClass={getTrustColor(stats.kepercayaanAtasan || 0)} />
            <StatRow icon={Activity} label="Tingkat Stres" value={`${stats.tingkatStres || 0}/100`} colorClass={getStressColor(stats.tingkatStres || 0)} />
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Pengaruh Politik</h2>
          <div className="flex flex-col">
            <StatRow icon={Users} label="Political Power" value={`${stats.politicalPower || 0}/100`} />
            <StatRow icon={Globe} label="Opini Publik" value={`${stats.opiniPublik || 0}/100`} />
            <StatRow icon={Building} label="Dukungan Partai" value={`${stats.dukunganPartai || 0}/100`} />
          </div>
        </div>
      </div>
    </div>
  );
};
