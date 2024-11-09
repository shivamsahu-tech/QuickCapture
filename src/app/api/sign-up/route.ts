import pool from "@/db/db";
import { generateAccessAndRefreshToken } from "@/utils/jwt";
import {nanoid} from 'nanoid'
import bcrypt from 'bcrypt'
import { cookies } from "next/headers";
import sendEmail from "@/utils/sendEmail";

export async function POST(request: Request) {
    /**
     * Algo:
     * retrieve the email and password
     * check if email alredy exist:- return user already exist
     * generate a accessToken and refreshToken,
     * hash password
     * save data in database
     * return success msg with cookie accessToken and refreshToken
     */

    try {
        const { email, password } = await request.json();

        console.log("email : ", email, "  password : ", password);
    
        const result = await pool.query(`select * from users where email = $1`,  [email]);

        if(result.rows.length > 0){
            if(!result.rows[0].isverified){
                //delete existing user
                await pool.query(`delete from users where email = $1`, [email]);
            }
            else{
                return new Response(JSON.stringify({
                    success: false,
                    message: "User already Exist!!"
                }),
                {
                    status: 409
                }
                )
            }
        }
       
        const userId = nanoid();
        const {accessToken, refreshToken} = generateAccessAndRefreshToken(userId, email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
    
        const query = `INSERT INTO users (id, email, password, refreshToken, otp, expires_at) VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '10 minutes');`;
        const values = [userId, email, hashedPassword, refreshToken, otp];
        const insertResult = await pool.query(query, values);
      
        await sendEmail({email, subject:"OTP Verification", otp})
  
        const cookieStore = cookies();
        cookieStore.set("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        cookieStore.set("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        
        return new Response(JSON.stringify({
            success: true,
            message: "User signed up successfully",
            data: insertResult
        }), { status: 201 });

    } catch (error) {
        console.error("user sign-up error : ", error);
        return new Response(JSON.stringify({
                success: false,
                message: "Something went wrong!!",
                error: error
            }),
            {
                status: 500
            }
            )
    }
}
