import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/db';
import { ProjectModel } from '@/models/Project';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const projects = await ProjectModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return Response.json(projects);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  await dbConnect();

  const project = await ProjectModel.create({
    userId,
    title: body.title || 'Untitled Project',
    files: body.files || []
  });

  return Response.json(project);
}
