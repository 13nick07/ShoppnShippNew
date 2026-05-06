import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth'; // your JWT helper

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    return new Response(JSON.stringify({ user: payload }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}