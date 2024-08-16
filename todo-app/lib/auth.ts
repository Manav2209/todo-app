import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '@/app/config'; // Ensure this matches your actual config

export async function authMiddleware(req: NextRequest): Promise<string | null> {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };
    return decoded.id; // Return the user ID from the token
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
