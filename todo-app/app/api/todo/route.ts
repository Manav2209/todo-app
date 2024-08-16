import { NextRequest, NextResponse } from 'next/server';
import { TodoSchema } from '@/schema/TodoSchema';
import prismaClient from '@/lib/db';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const userId = await authMiddleware(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = TodoSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ message: 'Incorrect inputs' }, { status: 411 });
    }

    const todo = await prismaClient.todo.create({
      data: {
        userId: Number(userId),
        title: parsedData.data.title,
        description: parsedData.data.description,
        status: parsedData.data.status,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// Append this to the existing `app/api/todos/route.ts` file

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const statusSchema = z.enum(['pending', 'inprogress', 'completed']).optional();
    const validatedStatus = statusSchema.safeParse(status);

    const userId = await authMiddleware(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const todos = await prismaClient.todo.findMany({
      where: {
        userId: Number(userId),
        ...(validatedStatus.success ? { status: validatedStatus.data } : {}),
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      console.error('Error fetching todos:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

