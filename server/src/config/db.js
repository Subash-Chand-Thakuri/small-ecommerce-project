import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import dotenv from 'dotenv';

dotenv.config();

let db;

export const initializeDb = async () => {
  try {
    const connection = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Initialize Drizzle with the MySQL connection
    db = drizzle(connection);

    console.log('Database connected successfully.');
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the app if DB connection fails
  }
};

export { db };
