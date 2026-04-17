'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatMessage, ChatMode } from '@/types/project';

const modeOptions: Array<{ value: ChatMode; label: string }> = [
  { value: 'generate', label: 'Generate' },
  { value: 'edit', label: 'Edit' },
  { value: 'improve', label: 'Improve UI' },
  { value: 'explain', label: 'Explain' }
];

type Props = {
  messages: ChatMessage[];
  streamingText: string;
  onSend: (prompt: string, mode: ChatMode) => Promise<void>;
};

export function ChatPanel({ messages, streamingText, onSend }: Props) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<ChatMode>('generate');
  const [loading, setLoading] = useState(false);

  const quickActions = useMemo(
    () => [
      { label: 'Generate landing page', text: 'Create a premium SaaS landing page with hero, features, pricing, and CTA.' },
      { label: 'Improve animations', text: 'Improve motion, spacing, hover effects, and modern gradient visuals.' },
      { label: 'Mobile optimize', text: 'Make this UI fully responsive and optimized for mobile screens.' },
      { label: 'Explain code', text: 'Explain this code architecture and suggest improvements.' }
    ],
    []
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    await onSend(prompt, mode);
    setPrompt('');
    setLoading(false);
  };

  return (
    <section className="glass flex h-full flex-col rounded-2xl p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              setPrompt(action.text);
              if (action.label.includes('Explain')) setMode('explain');
            }}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 transition hover:border-accent2 hover:text-white"
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="mb-3 min-h-0 flex-1 space-y-2 overflow-auto text-sm">
        {messages.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className={`rounded-xl p-2 ${msg.role === 'user' ? 'bg-white/15' : 'bg-accent/20'}`}>
            <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">{msg.mode ?? msg.role}</p>
            {msg.content}
          </div>
        ))}
        {streamingText && (
          <div className="rounded-xl bg-accent/30 p-2">
            <div className="mb-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/70">
              <Sparkles size={10} /> streaming
            </div>
            {streamingText}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ChatMode)}
            className="h-10 rounded-xl border border-white/20 bg-black/30 px-3 text-xs"
          >
            {modeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            className="h-10 flex-1 rounded-xl border border-white/20 bg-black/30 px-3 text-sm outline-none focus:border-accent2"
            placeholder="Ask AI to generate, edit, improve, or explain..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button disabled={loading} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
      </form>
    </section>
  );
}
