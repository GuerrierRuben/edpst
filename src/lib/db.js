// src/lib/db.js
import { Pool } from 'pg';

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Moderate connection limit for dev environment
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10s to prevent timeouts
  ssl: process.env.DATABASE_URL?.includes('supabase.co') ? { rejectUnauthorized: false } : false
};

// Singleton pattern for development
let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  if (!global.pgPool) {
    global.pgPool = new Pool(poolConfig);
    // Add error listener to prevent process crash
    global.pgPool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  pool = global.pgPool;
}

export const query = (text, params) => pool.query(text, params);
export { pool };