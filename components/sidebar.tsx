'use client';

import { Plus, FolderOpen } from 'lucide-react';
import { Project } from '@/types/project';

type Props = {
  projects: Project[];
  activeProjectId?: string;
  onSelect: (project: Project) => void;
  onCreate: () => void;
};

export function Sidebar({ projects, activeProjectId, onSelect, onCreate }: Props) {
  return (
    <aside className="glass flex h-full w-full flex-col rounded-2xl p-3">
      <button
        onClick={onCreate}
        className="mb-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-black"
      >
        <Plus size={16} /> New Project
      </button>
      <div className="space-y-2 overflow-auto">
        {projects.map((project) => (
          <button
            key={project._id ?? project.title}
            onClick={() => onSelect(project)}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
              activeProjectId === project._id ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <FolderOpen size={14} />
            <span className="truncate">{project.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
