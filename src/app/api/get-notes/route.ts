import pool from "@/db/db";
import { verifyAccessToken } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function GET(request: Request) {

    try {
        const cookieStore = cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Unauthorized token"
                }),
                { status: 401 }
            );
        }

        const { userId } = verifyAccessToken(accessToken);

        
        const userResponse = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        
       
        if (userResponse.rows.length === 0 || !userResponse.rows[0].isverified) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Unauthorized user"
                }),
                { status: 403 }
            );
        }

        // Now, insert or fetch notes into the db
        const response = await pool.query("SELECT id, title, text, color, type FROM notes WHERE userid = $1", [userId]);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Notes fetched successfully",
                data: response.rows // Returning all notes if needed
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST request:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error"
            }),
            { status: 500 }
        );
    }
}
