import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connexion à la base de données établie avec succès');
    client.release();
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
}
