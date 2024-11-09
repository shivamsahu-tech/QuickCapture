import pool from "@/db/db";
import { verifyAccessToken } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const Note = await request.json();
        console.log("NOTES IS:", Note);
        
        const cookieStore = cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return new Response(JSON.stringify({
                success: false,
                message: "Unauthorized token"
            }), {
                status: 401 // 401 Unauthorized
            });
        }

        const { userId } = verifyAccessToken(accessToken);

        const userResponse = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (userResponse.rows.length === 0 || !userResponse.rows[0].isverified) {
            return new Response(JSON.stringify({
                success: false,
                message: "Unauthorized user"
            }), {
                status: 403 // 403 Forbidden
            });
        }

        // Check if the note already exists
        const isNoteResult = await pool.query("SELECT * FROM notes WHERE id = $1", [Note.id]);
        if (isNoteResult.rows.length > 0) {
            // Note exists, update it
            await pool.query(
                "UPDATE notes SET title = $1, text = $2, color = $3, type = $4 WHERE id = $5", 
                [Note.title, Note.text, Note.color, Note.type, Note.id]
            );

            return new Response(JSON.stringify({
                success: true,
                message: "Note updated successfully"
            }), {
                status: 200 // 200 OK for successful update
            });
        }

        // Insert new note into the database
        await pool.query(
            "INSERT INTO notes (id, userid, title, text, color, type) VALUES ($1, $2, $3, $4, $5, $6)", 
            [Note.id, userId, Note.title, Note.text, Note.color, Note.type]
        );

        return new Response(JSON.stringify({
            success: true,
            message: "Note saved successfully"
        }), {
            status: 201 // 201 Created for new note
        });
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "An error occurred while processing the request"
        }), {
            status: 500 // 500 Internal Server Error
        });
    }
}
