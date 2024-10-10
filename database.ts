import { config } from "./config";
import { PrismaClient } from '@prisma/client';

// Load environment variables
const { name, username, password, host, dialect, logging } = config;

// Database connection
export const database = new PrismaClient()