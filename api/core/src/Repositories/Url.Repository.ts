import mysql from "mysql2/promise";
import { config as configEnvironmentVariables } from "dotenv";

// Environment Variables
configEnvironmentVariables();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
});

export interface UrlEntityI {
  id: number;
  url: string;
}

export interface UrlRepositoryI {
  addUrl(url: string): Promise<UrlEntityI>;
  getUrlById(id: number): Promise<UrlEntityI | null>;
}

export class MysqlUrlRepository implements UrlRepositoryI {
  public async addUrl(url: string): Promise<UrlEntityI> {
    const connection = await pool.getConnection();

    try {
      // FIXME: type
      const [result]: any = await connection.query(
        "INSERT INTO urls (url) VALUES (?)",
        [url]
      );

      return {
        id: result.insertId,
        url: url,
      };
    } finally {
      connection.release();
    }
  }

  public async getUrlById(id: number): Promise<UrlEntityI | null> {
    const connection = await pool.getConnection();

    try {
      // FIXME: type
      const [result]: any = await connection.query(
        "SELECT id, url FROM urls WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        return null;
      }

      return {
        id: result[0].id,
        url: result[0].url,
      };
    } finally {
      connection.release();
    }
  }
}
