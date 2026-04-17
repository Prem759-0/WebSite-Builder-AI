'use client';

import { useEffect } from 'react';
import JSZip from 'jszip';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import type { Route } from 'next';
import { Download, Save, Trash2, Wand2 } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { CodeEditor } from '@/components/code-editor';
import { LivePreview } from '@/components/live-preview';
import { ChatPanel } from '@/components/chat-panel';
import { findActiveFile, useBuilderStore } from '@/store/builder-store';
import { ChatMode, Project } from '@/types/project';

const starterProject: Project = {
  title: 'Untitled Project',
  files: [
    {
      path: 'index.html',
      language: 'html',
      content:
        "<!DOCTYPE html><html><head><meta charset='UTF-8'/><meta name='viewport' content='width=device-width, initial-scale=1.0'/><script src='https://cdn.tailwindcss.com'></script></head><body class='min-h-screen bg-slate-950 text-white grid place-items-center'><h1 class='text-4xl font-bold'>AI Builder Ready</h1></body></html>"
    }
  ]
};

const extractCodeFromResponse = (text: string) => {
  const fenced = text.match(/```(?:html)?\n([\s\S]*?)```/i);
  return fenced?.[1]?.trim() || text.trim();
};

export default function BuilderPage() {
  const {
    projects,
    activeProject,
    activePath,
    chat,
    streamingText,
    setProjects,
    setActiveProject,
    setActivePath,
    updateFile,
    addChat,
    setStreamingText
  } = useBuilderStore();

  useEffect(() => {
    void (async () => {
      const response = await fetch('/api/project');
      if (!response.ok) return;
      const data = (await response.json()) as Project[];
      setProjects(data);
      if (data.length > 0) setActiveProject(data[0]);
    })();
  }, [setActiveProject, setProjects]);

  const createProject = async () => {
    const response = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(starterProject)
    });
    if (!response.ok) return;
    const created = (await response.json()) as Project;
    setProjects([created, ...projects]);
    setActiveProject(created);
  };

  const saveProject = async () => {
    if (!activeProject?._id) return;
    await fetch(`/api/project/${activeProject._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeProject)
    });
  };

  const deleteProject = async () => {
    if (!activeProject?._id) return;
    await fetch(`/api/project/${activeProject._id}`, { method: 'DELETE' });
    const next = projects.filter((project) => project._id !== activeProject._id);
    setProjects(next);
    setActiveProject(next[0]);
  };

  const sendPrompt = async (prompt: string, mode: ChatMode) => {
    if (!activeProject) return;
    addChat({ role: 'user', content: prompt, mode });
    setStreamingText('');

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode, files: activeProject.files, chat })
    });
    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').map((line) => line.trim());
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.replace(/^data:\s*/, '');
        if (!data || data === '[DONE]') continue;
        try {
          const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
          const token = json.choices?.[0]?.delta?.content ?? '';
          if (token) {
            assistantText += token;
            setStreamingText(assistantText);
          }
        } catch {
          // ignore partial JSON chunks
        }
      }
    }

    addChat({ role: 'assistant', content: assistantText || 'No response.', mode });
    setStreamingText('');

    const active = findActiveFile(activeProject, activePath);
    if (active && (mode === 'generate' || mode === 'edit' || mode === 'improve')) {
      updateFile(active.path, extractCodeFromResponse(assistantText));
    }
  };

  const exportProject = async () => {
    if (!activeProject) return;
    const zip = new JSZip();
    activeProject.files.forEach((file) => zip.file(file.path, file.content));
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${activeProject.title.replace(/\s+/g, '-').toLowerCase() || 'project'}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SignedOut>
        <main className="grid min-h-screen place-items-center p-6">
          <div className="glass rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <Link className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-black" href={'/sign-in' as Route}>
              Continue to sign in
            </Link>
          </div>
        </main>
      </SignedOut>
      <SignedIn>
        <main className="grid min-h-screen grid-cols-1 gap-3 p-3 lg:grid-cols-[280px_1fr_1fr] lg:grid-rows-[auto_1fr_260px]">
          <div className="glass flex items-center justify-between rounded-2xl px-3 py-2 lg:col-span-3">
            <div className="inline-flex items-center gap-2 text-sm text-white/80">
              <Wand2 size={14} className="text-accent2" />
              AI Builder Workspace
            </div>
            <div className="flex items-center gap-2">
              <button onClick={createProject} className="rounded-xl border border-white/20 px-3 py-2 text-xs">
                New
              </button>
              <button onClick={saveProject} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-xs">
                <Save size={14} /> Save
              </button>
              <button onClick={exportProject} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-black">
                <Download size={14} /> Export
              </button>
              <button onClick={deleteProject} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/50 px-3 py-2 text-xs text-rose-300">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>

          <div className="lg:row-span-2">
            <Sidebar
              projects={projects}
              activeProjectId={activeProject?._id}
              onCreate={createProject}
              onSelect={(project) => setActiveProject(project)}
            />
          </div>

          <div className="min-h-[360px]">
            <CodeEditor
              files={activeProject?.files ?? starterProject.files}
              activePath={activePath ?? starterProject.files[0].path}
              onPathChange={setActivePath}
              onChange={(content) => {
                const path = activePath ?? starterProject.files[0].path;
                updateFile(path, content);
              }}
            />
          </div>

          <div className="min-h-[360px]">
            <LivePreview files={activeProject?.files ?? starterProject.files} />
          </div>

          <div className="lg:col-span-2">
            <ChatPanel messages={chat} streamingText={streamingText} onSend={sendPrompt} />
          </div>
        </main>
      </SignedIn>
    </>
  );
}
