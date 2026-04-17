'use client';

import dynamic from 'next/dynamic';
import { ProjectFile } from '@/types/project';

const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Props = {
  files: ProjectFile[];
  activePath?: string;
  onPathChange: (path: string) => void;
  onChange: (value: string) => void;
};

export function CodeEditor({ files, activePath, onPathChange, onChange }: Props) {
  const activeFile = files.find((f) => f.path === activePath) ?? files[0];

  return (
    <section className="glass flex h-full flex-col rounded-2xl overflow-hidden">
      <div className="flex gap-1 border-b border-white/15 p-2">
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => onPathChange(file.path)}
            className={`rounded-lg px-3 py-1 text-xs ${activeFile?.path === file.path ? 'bg-accent text-white' : 'hover:bg-white/10'}`}
          >
            {file.path}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        <Monaco
          theme="vs-dark"
          language={activeFile?.language ?? 'typescript'}
          value={activeFile?.content ?? ''}
          onChange={(value) => onChange(value ?? '')}
          options={{ minimap: { enabled: false }, fontSize: 14, smoothScrolling: true }}
        />
      </div>
    </section>
  );
}
