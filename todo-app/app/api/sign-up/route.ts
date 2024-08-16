// app/api/sign-up/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signUpSchema } from '@/schema/signUpSchema'; // Ensure this path is correct
import prismaClient from '@/lib/db'; // Ensure this path is correct
import bcrypt from 'bcryptjs';

// POST method handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    // Parse and validate request body
    const parsedData = signUpSchema.safeParse(body);
    console.log(parsedData.data);
    if (!parsedData.success) {
      return NextResponse.json({
        success: false,
        message: 'Incorrect inputs',
      }, { status: 411 });
    }

    const { name, email, password } = parsedData.data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully.',
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({
      success: false,
      message: 'Error registering user',
    }, { status: 500 });
  }
}
