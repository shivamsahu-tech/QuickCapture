// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;


/**
// pages/api/addUser.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email } = req.body;

    try {
      const query = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
      const values = [username, email];
      const result = await pool.query(query, values);

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ success: false, message: 'Database error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

 */
