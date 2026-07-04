import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Campaign } from '../types';
import { MessageSquare, Send, Award, HelpCircle, Shield, User, Shuffle } from 'lucide-react';

interface ChatPanelProps {
  campaignId: string;
  messages: ChatMessage[];
  currentUserId: string;
  currentUserName: string;
  isGm: boolean;
  playersList: { userId: string; userName: string }[];
  onSendMessage: (text: string, isWhisper: boolean, recipientId?: string) => void;
}

export default function ChatPanel({
  campaignId,
  messages,
  currentUserId,
  currentUserName,
  isGm,
  playersList,
  onSendMessage
}: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const [isWhisper, setIsWhisper] = useState(false);
  const [whisperRecipientId, setWhisperRecipientId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(
      inputText.trim(),
      isWhisper,
      isWhisper ? whisperRecipientId : undefined
    );

    setInputText('');
  };

  // Helper to trigger direct macro rolls
  const triggerQuickRoll = (formula: string) => {
    onSendMessage(`/roll ${formula}`, false);
  };

  return (
    <div className="bg-black border border-white/10 p-6 shadow-2xl flex flex-col h-[520px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-zinc-500" size={16} />
          <h2 className="text-xs font-display font-bold text-white tracking-widest uppercase">Console de Comunicação</h2>
        </div>
        <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
          CMD: <code className="bg-white/10 px-1.5 py-0.5 border border-white/5 text-white">/roll 1d20+5</code>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-3 custom-scrollbar">
        {messages.map((msg) => {
          // If whisper, check if current user is allowed to see it (sender, recipient, or GM)
          if (msg.isWhisper) {
            const isSender = msg.senderId === currentUserId;
            const isRecipient = msg.recipientId === currentUserId;
            // GM can see all whispers to/from GM, or if they are the GM
            const canSee = isSender || isRecipient || isGm;

            if (!canSee) return null;
          }

          return (
            <div 
              key={msg.id} 
              className={`p-3 text-[11px] font-mono tracking-wide border-l-2 ${
                msg.isWhisper 
                  ? 'bg-purple-950/20 border-purple-500 text-purple-200'
                  : msg.isDiceRoll
                  ? 'bg-amber-950/15 border-amber-500 text-amber-200'
                  : 'bg-zinc-950/40 border-white/20 text-zinc-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px]">
                  {msg.senderId === 'gm' ? (
                    <Shield size={10} className="text-amber-500" />
                  ) : (
                    <User size={10} className="text-white" />
                  )}
                  <span className="text-white">{msg.senderName}</span>
                  {msg.isWhisper && (
                    <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 border border-purple-500/20">
                      CRYPT
                    </span>
                  )}
                </div>
                <span className="text-[8px] text-zinc-500 font-mono tracking-widest">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Content */}
              <div className="leading-relaxed">
                {msg.isDiceRoll ? (
                  <div className="space-y-1.5 mt-2">
                    <div className="text-[9px] font-mono tracking-widest uppercase text-zinc-500">
                      SYS.ROLL: <strong className="text-amber-500">{msg.diceFormula}</strong>
                    </div>
                    <div className="flex items-center gap-2 mt-1 bg-black p-2 border border-amber-500/30">
                      <Shuffle size={12} className="text-amber-500 shrink-0" />
                      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                        HASH: [{msg.diceResults?.join(', ')}] = <strong className="text-black bg-amber-500 px-1.5 py-0.5 ml-1">{msg.diceTotal}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Rollers Row */}
      <div className="no-print grid grid-cols-4 gap-1.5 mb-3 border-t border-white/5 pt-3">
        <button 
          onClick={() => triggerQuickRoll('1d20')} 
          className="py-1.5 bg-black hover:bg-white/5 border border-white/10 font-mono text-[9px] font-bold text-amber-500 transition cursor-pointer tracking-widest uppercase"
        >
          D20
        </button>
        <button 
          onClick={() => triggerQuickRoll('1d6')} 
          className="py-1.5 bg-black hover:bg-white/5 border border-white/10 font-mono text-[9px] font-bold text-amber-500 transition cursor-pointer tracking-widest uppercase"
        >
          D6
        </button>
        <button 
          onClick={() => triggerQuickRoll('1d100')} 
          className="py-1.5 bg-black hover:bg-white/5 border border-white/10 font-mono text-[9px] font-bold text-amber-500 transition cursor-pointer tracking-widest uppercase"
        >
          D100
        </button>
        <button 
          onClick={() => triggerQuickRoll('2d6+4')} 
          className="py-1.5 bg-black hover:bg-white/5 border border-white/10 font-mono text-[9px] font-bold text-amber-500 transition cursor-pointer tracking-widest uppercase"
        >
          2D6+4
        </button>
      </div>

      {/* Input Panel Form */}
      <form onSubmit={handleSend} className="space-y-3 mt-auto">
        {/* Secret / Whisper Options */}
        <div className="flex items-center justify-between gap-2 text-[9px] font-mono tracking-widest uppercase text-zinc-500">
          <label className="flex items-center gap-1.5 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={isWhisper}
              onChange={(e) => {
                setIsWhisper(e.target.checked);
                if (e.target.checked && playersList.length > 0 && !whisperRecipientId) {
                  setWhisperRecipientId(playersList[0].userId);
                }
              }}
              className="accent-purple-500 rounded-none bg-black border border-white/20"
            />
            CANAL PRIVADO
          </label>

          {isWhisper && (
            <select
              value={whisperRecipientId}
              onChange={(e) => setWhisperRecipientId(e.target.value)}
              className="bg-black border border-white/20 px-2 py-1 text-[9px] font-mono tracking-widest uppercase text-zinc-300 focus:outline-none focus:border-white"
            >
              <option value="">-- TARGET --</option>
              {isGm ? (
                playersList.map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.userName}
                  </option>
                ))
              ) : (
                <option value="gm">HOST [GM]</option>
              )}
            </select>
          )}
        </div>

        {/* Input Text Box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Aguardando input..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs font-mono tracking-wide text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black transition shrink-0 cursor-pointer font-bold flex items-center justify-center"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
