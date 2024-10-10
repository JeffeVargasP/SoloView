import dotenv from 'dotenv';
dotenv.config();

interface IConfig {
    serverPort: number;
    saltRounds: number;
    secret: string;
    name: string;
    username: string;
    password: string;
    host: string;
    dialect: string;
    logging: boolean;
    ssl: boolean;
    databaseUrl?: string;
}

export const config: IConfig = {
    serverPort: parseInt(process.env.PORT || '3000'),
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
    secret: process.env.SECRET || '',
    name: process.env.DB_NAME || '',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || '',
    databaseUrl: process.env.DATABASE_URL || '',
    dialect: 'postgres',
    logging: false,
    ssl: true,
}