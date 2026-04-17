import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/db';
import { ProjectModel } from '@/models/Project';

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const project = await ProjectModel.findOne({ _id: id, userId }).lean();
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(project);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  await dbConnect();

  const updated = await ProjectModel.findOneAndUpdate(
    { _id: id, userId },
    { title: body.title, files: body.files },
    { new: true }
  ).lean();

  if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  await ProjectModel.deleteOne({ _id: id, userId });
  return Response.json({ success: true });
}
