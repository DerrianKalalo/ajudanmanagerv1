import React from 'react';
import { GameResponse, GameStats, Option } from '../types';
import Markdown from 'react-markdown';
import { Calendar, Shield, Star, BrainCircuit, Handshake, Newspaper, User, CheckCircle2, AlertCircle, Send, Loader2, RefreshCw, Briefcase, UserCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GameLayoutProps {
  gameData: GameResponse | null;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  isInitial: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ gameData, isLoading, onSendMessage, isInitial }) => {
  const [input, setInput] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('harian');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const stats = gameData?.stats;

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
    <div className="relative w-full h-screen overflow-hidden bg-zinc-900 font-sans text-zinc-100 flex justify-center items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/office/1920/1080?blur=4")' }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] h-full p-4 md:p-6 flex flex-col md:flex-row gap-6">
        
        {/* LEFT PANEL */}
        <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col gap-4 h-full shrink-0">
          {/* Status Bar */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden shadow-2xl shrink-0">
            <div className="bg-[#222] py-2 px-4 border-b border-[#333] text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Status Ajudan</span>
            </div>
            <div className="grid grid-cols-5 divide-x divide-[#333] py-3 px-1">
              <div className="flex flex-col items-center justify-start gap-1.5">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="text-[10px] font-mono text-center leading-none text-zinc-300">Hari {stats?.hari || 1}</span>
              </div>
              <div className="flex flex-col items-center justify-start gap-1.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono text-center leading-none text-zinc-300">Percaya<br/>{stats?.kepercayaanAtasan || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-start gap-1.5">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-[10px] font-mono text-center leading-none text-zinc-300">Reputasi<br/>{stats?.reputasiPribadi || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-start gap-1.5 bg-red-950/20 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-red-500" />
                <span className="text-[10px] font-mono text-center leading-none text-red-400">Stres<br/>{stats?.tingkatStres || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-start gap-1.5">
                <Handshake className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-mono text-center leading-none text-zinc-300">Jaringan<br/>{stats?.politicalPower || 0}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Tab */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {activeTab === 'harian' && (
              <>
                {/* Middle Section: News & Boss */}
                <div className="flex gap-4 h-[220px] shrink-0">
                  {/* News */}
                  <div className="flex-1 bg-[#f4f1ea] rounded-xl p-4 text-black shadow-inner overflow-hidden relative border border-[#dcd8c9]">
                    <div className="flex items-center justify-center border-b-2 border-black pb-2 mb-3">
                      <h2 className="font-serif font-bold text-lg tracking-widest uppercase">Berita Hari Ini</h2>
                    </div>
                    <div className="space-y-3 overflow-y-auto h-[130px] pr-2">
                      {gameData?.newsHeadlines?.map((news, idx) => (
                        <div key={idx} className="border-b border-black/20 pb-2">
                          <h3 className="font-serif font-bold text-xs leading-tight">{news}</h3>
                        </div>
                      ))}
                      {!gameData?.newsHeadlines?.length && (
                        <p className="text-xs font-serif italic text-center text-black/50 mt-4">Belum ada berita penting hari ini.</p>
                      )}
                    </div>
                  </div>

                  {/* Current Boss */}
                  <div className="w-[130px] bg-[#1a1a1a] border border-[#333] rounded-xl p-3 flex flex-col items-center justify-between shadow-2xl">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest text-center">Current Boss</span>
                    <div className="w-20 h-20 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden my-2 shrink-0">
                      <img src="https://picsum.photos/seed/boss/200/200" alt="Boss" className="w-full h-full object-cover grayscale opacity-80" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif font-bold text-xs leading-tight text-amber-500 line-clamp-2">{stats?.atasan || "Belum Ada"}</h3>
                      <p className="text-[9px] text-zinc-500 mt-1">Menteri/Pejabat</p>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl flex flex-col shadow-2xl overflow-hidden">
                  <div className="bg-[#222] py-2 px-4 border-b border-[#333] text-center">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Tugas Hari Ini</span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto space-y-2">
                    {gameData?.tasks?.map((task, idx) => (
                      <div key={idx} className="bg-[#2a2a2a] rounded-lg p-3 border border-[#444]">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-zinc-800 rounded-md shrink-0">
                            <AlertCircle className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-zinc-200 mb-1">{task.title}</h4>
                            <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${task.progress || 0}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!gameData?.tasks?.length && (
                      <div className="h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
                        Tidak ada tugas aktif.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'krisis' && (
              <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl flex flex-col shadow-2xl overflow-hidden">
                <div className="bg-[#222] py-2 px-4 border-b border-[#333] text-center">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Krisis Aktif</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs font-mono text-zinc-500">Tidak ada krisis yang memerlukan<br/>perhatian khusus saat ini.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bursa' && (
              <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl flex flex-col shadow-2xl overflow-hidden">
                <div className="bg-[#222] py-2 px-4 border-b border-[#333] text-center">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Bursa Transfer</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {gameData?.notifications?.map((notif, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-red-950 to-zinc-900 border border-red-900/50 rounded-xl p-3 shadow-md flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-400 text-xs mb-1">{notif.title}</h4>
                        <p className="text-[10px] text-zinc-300">{notif.description}</p>
                      </div>
                    </div>
                  ))}
                  {!gameData?.notifications?.length && (
                    <div className="text-center space-y-3 mt-10">
                      <Briefcase className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p className="text-xs font-mono text-zinc-500">Belum ada tawaran dari lembaga lain.<br/>Tingkatkan reputasi Anda.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl flex flex-col shadow-2xl overflow-hidden">
                <div className="bg-[#222] py-2 px-4 border-b border-[#333] text-center">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Profil Ajudan</span>
                </div>
                <div className="p-5 flex-1 overflow-y-auto space-y-6">
                  <div className="flex items-center gap-4 border-b border-[#333] pb-5">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center shrink-0">
                      <UserCircle className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-zinc-100 text-lg">Ajudan Menteri</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Tingkat: Eselon II</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-zinc-400">Opini Publik</span>
                        <span className="text-zinc-100">{stats?.opiniPublik || 0}/100</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats?.opiniPublik || 0}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-zinc-400">Dukungan Partai Oligarki</span>
                        <span className="text-zinc-100">{stats?.dukunganPartai || 0}/100</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats?.dukunganPartai || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Nav */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-2 flex justify-between shadow-2xl shrink-0">
            <button 
              onClick={() => setActiveTab('harian')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${activeTab === 'harian' ? 'text-amber-500 bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-800/50'}`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px]">Harian</span>
            </button>
            <button 
              onClick={() => setActiveTab('krisis')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${activeTab === 'krisis' ? 'text-amber-500 bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-800/50'}`}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-[10px]">Krisis</span>
            </button>
            <button 
              onClick={() => setActiveTab('bursa')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'bursa' ? 'text-amber-500 bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-800/50'}`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-[10px]">Bursa</span>
              {gameData?.notifications?.length ? (
                <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              ) : null}
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${activeTab === 'profile' ? 'text-amber-500 bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-800/50'}`}
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>

        {/* CENTER PANEL (TABLET) */}
        <div className="flex-1 flex justify-center items-center h-full py-4">
          <div className="w-full max-w-[600px] h-full max-h-[850px] bg-[#e5e7eb] rounded-[2rem] p-3 shadow-2xl border-[8px] border-[#333] relative flex flex-col">
            {/* Tablet Screen */}
            <div className="flex-1 bg-white rounded-[1.5rem] overflow-hidden flex flex-col border border-zinc-300 relative">
              
              {/* Header */}
              <div className="bg-red-900 text-white py-3 px-6 text-center flex items-center justify-between shadow-md z-10">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h2 className="font-bold tracking-widest uppercase text-sm">{gameData?.eventTitle || "SISTEM BIROKRASI"}</h2>
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 flex flex-col gap-6">
                
                {/* Event Image */}
                <div className="w-full h-48 bg-zinc-200 rounded-xl overflow-hidden shadow-inner border border-zinc-300 shrink-0">
                  <img src="https://picsum.photos/seed/meeting/800/400" alt="Event" className="w-full h-full object-cover" />
                </div>

                {/* Narrative */}
                <div className="text-zinc-800 text-sm leading-relaxed font-serif prose prose-sm max-w-none">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-32 text-zinc-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" />
                      <p className="font-mono text-xs uppercase tracking-widest">Memproses Data...</p>
                    </div>
                  ) : (
                    <Markdown>{gameData?.narrative || "Menunggu instruksi..."}</Markdown>
                  )}
                </div>

                {/* Options */}
                {!isLoading && gameData?.options && gameData.options.length > 0 && (
                  <div className="mt-auto flex flex-col gap-3 pt-4">
                    {gameData.options.map((opt, idx) => {
                      const colors = [
                        "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-900",
                        "bg-slate-700 hover:bg-slate-600 text-white border-slate-800",
                        "bg-red-900 hover:bg-red-800 text-white border-red-950",
                        "bg-amber-800 hover:bg-amber-700 text-white border-amber-900"
                      ];
                      const colorClass = colors[idx % colors.length];

                      return (
                        <button
                          key={opt.id}
                          onClick={() => onSendMessage(opt.text)}
                          className={twMerge(
                            "w-full text-left p-4 rounded-xl border-b-4 transition-all active:border-b-0 active:translate-y-1 shadow-md flex flex-col gap-1",
                            colorClass
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                              <span className="font-bold text-xs">{String.fromCharCode(65 + idx)}</span>
                            </div>
                            <span className="font-bold text-sm">{opt.text}</span>
                          </div>
                          {opt.riskText && (
                            <span className="text-[10px] text-white/60 ml-9 font-mono">{opt.riskText}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Text Input for Initial State */}
                {!isLoading && isInitial && (
                  <form onSubmit={handleSubmit} className="mt-auto pt-4 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      className="w-full bg-white border-2 border-zinc-300 text-zinc-900 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-indigo-500 font-sans shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                )}

              </div>
            </div>
            {/* Tablet Home Button */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[#333] rounded-full"></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col gap-4 h-full shrink-0 justify-end">
          
          {/* Notifications */}
          {gameData?.notifications?.map((notif, idx) => (
            <div key={idx} className="bg-gradient-to-r from-red-950 to-zinc-900 border border-red-900/50 rounded-xl p-4 shadow-2xl flex items-start gap-4 animate-in slide-in-from-right">
              <div className="p-2 bg-red-900/50 rounded-lg shrink-0">
                <Briefcase className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-red-400 text-sm mb-1">{notif.title}</h4>
                <p className="text-xs text-zinc-300">{notif.description}</p>
              </div>
            </div>
          ))}

          {/* Butterfly Effect Memories */}
          <div className="bg-[#f4f1ea] border border-[#dcd8c9] rounded-xl flex flex-col shadow-2xl overflow-hidden h-[400px]">
            <div className="bg-[#e8e4d9] py-3 px-4 border-b border-[#dcd8c9] text-center">
              <span className="text-xs font-serif font-bold text-black uppercase tracking-widest italic">Memori Keputusan (Butterfly Effect)</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              {gameData?.memories?.map((mem, idx) => (
                <div key={idx} className="bg-white border border-[#dcd8c9] rounded-lg p-3 shadow-sm flex flex-col gap-1">
                  <span className="text-xs font-bold text-black">Hari {mem.hari}: {mem.text}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{mem.impact}</span>
                </div>
              ))}
              {!gameData?.memories?.length && (
                <div className="h-full flex items-center justify-center text-zinc-500 text-xs font-serif italic">
                  Belum ada keputusan krusial yang tercatat.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
