import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { chooseModel } from '@/lib/models';
import { ProjectFile } from '@/types/project';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as { prompt: string; files: ProjectFile[]; chat?: Array<{ role: string; content: string }> };

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      `data: ${JSON.stringify({ choices: [{ delta: { content: 'Missing OPENROUTER_API_KEY in .env.local' } }] })}\n\n` + 'data: [DONE]\n\n',
      { headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const model = chooseModel(body.prompt);
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
            'You are an elite UI engineer. When asked to generate a website, return full HTML only unless asked otherwise.'
        },
        ...(body.chat ?? []),
        { role: 'user', content: `${body.prompt}\n\nCurrent project files:\n${context}` }
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
