import { NextRequest, NextResponse } from 'next/server';
import { TodoSchema } from '@/schema/TodoSchema';
import prismaClient from '@/lib/db';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, status } = TodoSchema.parse(body);

    const userId = await authMiddleware(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const todo = await prismaClient.todo.update({
      where: { id: id },
      data: { title, description, status },
    });

    return NextResponse.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      console.error('Error updating todo:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const userId = await authMiddleware(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prismaClient.todo.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}