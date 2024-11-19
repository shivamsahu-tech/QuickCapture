export const dynamic = 'force-dynamic';

import pool from "@/db/db";
import { verifyAccessToken } from "@/utils/jwt";
import sendEmail from "@/utils/sendEmail";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
/**
 * Uses: for sending of in case of forget password request as well as change password request
 * 
 * Algo:
 * it have two cases
 * 1.when user have accessToken(in case of change password request)
 *    retreive user details from accessToken
 *    sent otp to that user and also save otp it in db
 *    return
 * 2.when user have only emial(in case of forget password request)
 *    if email exist send otp and save it in the db
 *    generate a unknowUserToken for further verification and store in cookie
 *    return
 *        
 */



export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (accessToken) {
            try {
                const { userId } = verifyAccessToken(accessToken);

                const otp = Math.floor(100000 + Math.random() * 900000);
                await pool.query("UPDATE users SET otp = $1, expires_at = NOW() + INTERVAL '10 minutes' WHERE id = $2", [otp, userId]);

                const result = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
                if (result.rowCount === 0) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: "User not found."
                    }), {
                        status: 404
                    });
                }

                const email = result.rows[0].email;
                await sendEmail({ email, subject: "OTP Verification", otp });

                return new Response(JSON.stringify({
                    success: true,
                    message: "OTP sent successfully!"
                }), {
                    status: 200
                });
            } catch (error) {
                console.error("Error:", error);
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid access token."
                }), {
                    status: 401
                });
            }
        }

        const { email } = await request.json();
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rowCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "If the email exists, an OTP has been sent." // To avoid enumeration
            }), {
                status: 200
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        await pool.query("UPDATE users SET otp = $1, expires_at = NOW() + INTERVAL '10 minutes' WHERE email = $2", [otp, email]);
        await sendEmail({ email, subject: "OTP Verification", otp });

        const unknownUserToken =  jwt.sign(
            { email },
            process.env.UNKNOWN_USER_TOKEN_SECRET || 'defaultSecret',
            { expiresIn: '10min' }
        );

        cookieStore.set("unknownUserToken", unknownUserToken, { httpOnly: true, secure: true, sameSite: 'strict' });

        return new Response(JSON.stringify({
            success: true,
            message: "OTP sent successfully!"
        }), {
            status: 200
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Something went wrong!"
        }), {
            status: 500
        });
    }
}
