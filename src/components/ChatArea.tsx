import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Option } from '../types';
import Markdown from 'react-markdown';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleOptionClick = (option: Option) => {
    if (!isLoading) {
      onSendMessage(option.text);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showTextInput = lastMessage?.role === 'model' && 
                        lastMessage.gameData?.options && 
                        lastMessage.gameData.options.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-zinc-900 h-full relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
            </div>
            <p className="font-mono text-sm">Memulai Simulasi...</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={twMerge(
              "max-w-4xl mx-auto flex flex-col w-full",
              msg.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={twMerge(
              "text-xs font-mono mb-2 opacity-50 uppercase tracking-widest",
              msg.role === 'user' ? "text-right" : "text-left"
            )}>
              {msg.role === 'user' ? 'Ajudan (Anda)' : 'Birokrasi Engine'}
            </div>
            
            {msg.role === 'user' ? (
              <div className="p-5 rounded-2xl shadow-sm w-full md:w-auto bg-indigo-600 text-white rounded-tr-sm">
                <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {msg.text && !msg.gameData && (
                   <div className="p-5 rounded-2xl bg-red-900/20 text-red-200 border border-red-900/50 rounded-tl-sm">
                     {msg.text}
                   </div>
                )}

                {msg.gameData?.narrative && (
                  <div className="p-6 rounded-2xl bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700/50 shadow-sm">
                    <div className="markdown-body prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-a:text-indigo-400">
                      <Markdown>{msg.gameData.narrative}</Markdown>
                    </div>
                  </div>
                )}

                {msg.gameData?.tasks && msg.gameData.tasks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {msg.gameData.tasks.map((task, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-zinc-100 mb-1">{task.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{task.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {msg.gameData?.options && msg.gameData.options.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Pilih Tindakan:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {msg.gameData.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionClick(opt)}
                          disabled={isLoading || msg !== messages[messages.length - 1]}
                          className="text-left p-4 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 shrink-0 mt-0.5 transition-colors" />
                          <span className="text-zinc-200 group-hover:text-white transition-colors">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-4xl mx-auto flex flex-col items-start w-full">
            <div className="text-xs font-mono mb-2 opacity-50 uppercase tracking-widest text-left">
              Birokrasi Engine
            </div>
            <div className="p-5 rounded-2xl rounded-tl-sm bg-zinc-800 text-zinc-400 border border-zinc-700/50 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-mono text-sm animate-pulse">Memproses keputusan...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showTextInput && (
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik input Anda di sini..."
              disabled={isLoading}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
