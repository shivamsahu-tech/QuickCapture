import jwt, { JwtPayload } from 'jsonwebtoken'

export const generateAccessAndRefreshToken = (userId:string, email:string) => {
    
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET || 'defaultSecret',
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '1h' }
    );

    const refreshToken = jwt.sign(
        { userId, email },
        process.env.REFRESH_TOKEN_SECRET || 'defaultSecret',
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '1h' }
    );
    
    return {accessToken, refreshToken};   

}

export const verifyAccessToken = (accessToken : string) => {
    const payload = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET || 'defaultSecret'
      ) as JwtPayload; 
    
      if (!payload.userId) {
        throw new Error("User ID not found in the token");
      }
    
      return payload; 
}