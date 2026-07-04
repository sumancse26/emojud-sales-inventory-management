import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || '';

    return new TextEncoder().encode(secret);
};

export async function signAccessToken(payload) {
    const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES || '';

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(accessExpiresIn)
        .sign(getJwtSecretKey());
}

export async function signRefreshToken(payload) {
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES || '';

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(refreshExpiresIn)
        .sign(getJwtSecretKey());
}

export async function verifyAuthToken(token) {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload;
    } catch (error) {
        return null;
    }
}
