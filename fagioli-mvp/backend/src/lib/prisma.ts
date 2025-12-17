import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Prisma client singleton to prevent multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// For Prisma 7, we need to provide an adapter for SQLite
// Extract the database path from DATABASE_URL (file:./dev.db -> ./dev.db)
const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const databasePath = databaseUrl.replace('file:', '');

// Initialize adapter with the database path
const adapter = new PrismaBetterSqlite3({ url: databasePath });

// Create Prisma client with the adapter
export const prisma = global.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
