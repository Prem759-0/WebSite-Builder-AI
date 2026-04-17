import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { chooseModel, models } from '@/lib/models';
import { ChatMode, ProjectFile } from '@/types/project';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const modePrompt: Record<ChatMode, string> = {
  generate: 'Generate complete, beautiful production-ready website code from the request.',
  edit: 'Edit the existing code with minimal targeted changes and return complete updated code.',
  improve: 'Improve UI/UX quality, spacing, typography, animations, and responsiveness.',
  explain: 'Explain the current code, architecture choices, and practical improvements.'
};

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as {
    prompt: string;
    mode?: ChatMode;
    files: ProjectFile[];
    chat?: Array<{ role: string; content: string }>;
  };

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      `data: ${JSON.stringify({ choices: [{ delta: { content: 'Missing OPENROUTER_API_KEY in .env.local' } }] })}\n\n` + 'data: [DONE]\n\n',
      { headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const mode = body.mode ?? 'generate';
  const model = mode === 'explain' ? models.reasoning : chooseModel(body.prompt);
  const context = body.files.map((f) => `FILE: ${f.path}\n${f.content}`).join('\n\n');

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'You are an elite full-stack UI engineer. Prefer returning complete code blocks for implementation requests and concise explanations for explain mode.'
        },
        ...(body.chat ?? []),
        {
          role: 'user',
          content: `${modePrompt[mode]}\n\nUser request:\n${body.prompt}\n\nCurrent project files:\n${context}`
        }
      ]
    })
  });

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
