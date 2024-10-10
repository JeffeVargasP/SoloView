import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../../config';

interface User {
    email: string;
}

function generateToken(email: string): string {
    const secret = config.secret;
    const token = sign({ email }, secret, {
        expiresIn: '1h',
    });
    return token;
}

function verifyToken(token: string): User {
    try {
        const secret = config.secret;
        const decoded = verify(token, secret) as User;
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

async function hashPassword(password: string): Promise<string> {
    const saltRounds = config.saltRounds;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}

export { generateToken, verifyToken, hashPassword, comparePassword };
