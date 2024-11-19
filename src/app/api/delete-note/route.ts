export const dynamic = 'force-dynamic';

import pool from '@/db/db';
import { verifyAccessToken } from '@/utils/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const {id} = await request.json();

  try {
    
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized token' }),
        { status: 401 }
      );
    }

    const { userId } = verifyAccessToken(accessToken);

    const userResponse = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResponse.rows.length === 0 || !userResponse.rows[0].isverified) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized user' }),
        { status: 403 }
      );
    }

    const noteResponse = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    if (noteResponse.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Note not found' }),
        { status: 404 }
      );
    }

    if (noteResponse.rows[0].userid !== userId) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not authorized to delete this note" }),
        { status: 403 }
      );
    }

    await pool.query('DELETE FROM notes WHERE id = $1', [id]);

    return new Response(
      JSON.stringify({ success: true, message: "Note deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting note:', error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error"}),
      { status: 500 }
    );
  }
}
