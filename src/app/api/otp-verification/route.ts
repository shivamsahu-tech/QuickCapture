export const dynamic = 'force-dynamic';

import pool from "@/db/db";
import { verifyAccessToken } from "@/utils/jwt";
import { cookies } from "next/headers";

/**
 * Algo:
 * retrieve otp
 * get cookie, accessToken
 * find id form token
 * get otp from db
 * get expires time from otp
 * compare if otp is valid within time : isVerifid = true
 * else send error msg
 * 
 */

export async function POST(request: Request) {
    
    const { otp } = await request.json();

    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
        return new Response(
        JSON.stringify({
            success: false,
            message: "Unauthorized User!!",
        }),
        {
            status: 401,
        }
        );
    }

    const { userId } = verifyAccessToken(accessToken);
   
    const result = await pool.query(
        `SELECT otp, expires_at, isVerified FROM users WHERE id = $1`,
        [userId]
    );

    const user = result.rows[0];

    
    
    
    if (!user) {
        return new Response(
        JSON.stringify({
            success: false,
            message: "User not found!",
        }),
        {
            status: 404,
        }
        );
    }

   

    const expiresAt = new Date(user.expires_at).getTime(); 
    const currentTime = Date.now();

    if (expiresAt < currentTime) {
        return new Response(
        JSON.stringify({
            success: false,
            message: "OTP Expired!!",
        }),
        {
            status: 400,
        }
        );
    }

   

    if (user.otp != otp) {
        return new Response(
        JSON.stringify({
            success: false,
            message: "Invalid OTP!!",
        }),
        {
            status: 400,
        }
        );
    }
    

    if (user.isVerified) {
        return new Response(
        JSON.stringify({
            success: false,
            message: "User is already verified!",
        }),
        {
            status: 400,
        }
        );

    }

   
    
    await pool.query(
        `UPDATE users SET isVerified = $1 WHERE id = $2`,
        [true, userId]
    );

    return new Response(
        JSON.stringify({
        success: true,
        message: "User Verified successfully",
        }),
        {
        status: 202,
        }
    );
}
