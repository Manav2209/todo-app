// app/api/sign-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signInSchema } from '@/schema/signInSchema'; // Adjust path if needed
import prismaClient from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '@/app/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Parse and validate request body
    const parsedData = signInSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({
        success: false,
        message: 'Incorrect inputs',
      }, { status: 411 });
    }

    const { email, password } = parsedData.data;

    // Find user by email
    const user = await prismaClient.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Sorry, credentials are incorrect',
      }, { status: 403 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Sorry, credentials are incorrect',
      }, { status: 403 });
    }

    // Sign the JWT
    const token = jwt.sign({ id: user.id }, JWT_PASSWORD, { expiresIn: '1h' });

    return NextResponse.json({
      success: true,
      token,
    }, { status: 200 });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json({
      success: false,
      message: 'Error during sign-in',
    }, { status: 500 });
  }
}
