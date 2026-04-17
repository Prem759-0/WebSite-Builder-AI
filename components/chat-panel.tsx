'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '@/types/project';

type Props = {
  messages: ChatMessage[];
  streamingText: string;
  onSend: (prompt: string) => Promise<void>;
};

export function ChatPanel({ messages, streamingText, onSend }: Props) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    await onSend(prompt);
    setPrompt('');
    setLoading(false);
  };

  return (
    <section className="glass flex h-full flex-col rounded-2xl p-3">
      <div className="mb-3 min-h-0 flex-1 space-y-2 overflow-auto text-sm">
        {messages.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className={`rounded-xl p-2 ${msg.role === 'user' ? 'bg-white/15' : 'bg-accent/20'}`}>
            {msg.content}
          </div>
        ))}
        {streamingText && <div className="rounded-xl bg-accent/30 p-2">{streamingText}</div>}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          className="h-10 flex-1 rounded-xl border border-white/20 bg-black/30 px-3 text-sm outline-none focus:border-accent2"
          placeholder="Ask AI to generate or edit UI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button disabled={loading} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black disabled:opacity-50">
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}
