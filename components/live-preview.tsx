'use client';

import { ProjectFile } from '@/types/project';

const defaultHtml = `<!DOCTYPE html><html><head><meta charset='UTF-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0' /><script src='https://cdn.tailwindcss.com'></script></head><body class='bg-slate-950 text-white p-8'><h1 class='text-3xl font-bold'>Start prompting to build your site</h1></body></html>`;

export function LivePreview({ files }: { files: ProjectFile[] }) {
  const htmlFile = files.find((file) => file.path.endsWith('.html'));
  const srcDoc = htmlFile?.content || defaultHtml;

  return (
    <section className="glass h-full overflow-hidden rounded-2xl">
      <iframe title="preview" sandbox="allow-scripts allow-same-origin" srcDoc={srcDoc} className="h-full w-full border-0" />
    </section>
  );
}
