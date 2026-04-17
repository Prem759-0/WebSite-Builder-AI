'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ProjectFile } from '@/types/project';

const defaultHtml = `<!DOCTYPE html><html><head><meta charset='UTF-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0' /><script src='https://cdn.tailwindcss.com'></script></head><body class='bg-slate-950 text-white p-8'><h1 class='text-3xl font-bold'>Start prompting to build your site</h1></body></html>`;

type Viewport = 'mobile' | 'tablet' | 'desktop';

const viewportClassMap: Record<Viewport, string> = {
  mobile: 'max-w-[390px]',
  tablet: 'max-w-[768px]',
  desktop: 'max-w-full'
};

export function LivePreview({ files }: { files: ProjectFile[] }) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [key, setKey] = useState(0);

  const htmlFile = files.find((file) => file.path.endsWith('.html'));
  const srcDoc = htmlFile?.content || defaultHtml;

  const viewportButtons = useMemo(
    () => [
      { id: 'mobile' as const, icon: Smartphone },
      { id: 'tablet' as const, icon: Tablet },
      { id: 'desktop' as const, icon: Monitor }
    ],
    []
  );

  return (
    <section className="glass flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/15 p-2">
        <div className="flex items-center gap-1">
          {viewportButtons.map((item) => (
            <button
              key={item.id}
              onClick={() => setViewport(item.id)}
              className={`rounded-lg p-2 text-xs ${viewport === item.id ? 'bg-accent text-white' : 'hover:bg-white/10'}`}
              title={item.id}
            >
              <item.icon size={14} />
            </button>
          ))}
        </div>
        <button onClick={() => setKey((x) => x + 1)} className="rounded-lg p-2 text-xs hover:bg-white/10" title="Refresh Preview">
          <RefreshCw size={14} />
        </button>
      </div>
      <div className="grid h-full place-items-center bg-black/20 p-2">
        <iframe
          key={key}
          title="preview"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={srcDoc}
          className={`h-full w-full rounded-xl border border-white/15 bg-white transition-all ${viewportClassMap[viewport]}`}
        />
      </div>
    </section>
  );
}
