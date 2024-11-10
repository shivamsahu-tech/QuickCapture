import pool from "@/db/db";
import { verifyAccessToken } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function GET() {

    if (typeof window !== 'undefined') {
        console.log('Running on client, skipping cookie check');
        return new Response(JSON.stringify({ success: false, message: 'Client-side access not allowed' }), { status: 400 });
    }
    
    try {
        const cookieStore = cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        console.log("reached in sign out function")
        if (!accessToken) {
            return new Response(JSON.stringify({
                success: false,
                message: "Access token is missing or invalid."
            }), {
                status: 401
            });
        }

        let userId;
        try {
            const decodedToken = verifyAccessToken(accessToken);
            userId = decodedToken.userId;
        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid or expired access token."
            }), {
                status: 401
            });
        }

        const queryResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

        if (queryResult.rows.length > 0) {
            await pool.query(`UPDATE users SET refreshToken = $1 WHERE id = $2`, [null, userId]);
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            return new Response(JSON.stringify({
                success: true,
                message: "Logged out successfully."
            }), {
                status: 200
            });
        }

        // User does not exist
        return new Response(JSON.stringify({
            success: false,
            message: "User not found."
        }), {
            status: 404
        });

    } catch (error) {
        console.error("Sign-out error:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Something went wrong during sign-out."
        }), {
            status: 502
        });
    }
}
