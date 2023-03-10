import { config as configEnvironmentVariables } from "dotenv";
import mysql, { Pool } from "mysql2/promise";

// Environment Variables
configEnvironmentVariables();

export interface UrlEntityI {
  id: string;
  url: string;
}

export interface UrlRepositoryI {
  createShortUrl(url: string): Promise<UrlEntityI>;
  findById(id: number): Promise<UrlEntityI | null>;
  findByUrl(url: string): Promise<UrlEntityI | null>;
}

export class UrlRepository implements UrlRepositoryI {
  private pool: Pool;

  constructor() {
    this.createShortUrl = this.createShortUrl.bind(this);
    this.findById = this.findById.bind(this);
    this.findByUrl = this.findByUrl.bind(this);
    this.pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: true,
      },
    });
  }

  public async createShortUrl(url: string): Promise<UrlEntityI> {
    const connection = await this.pool.getConnection();

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

  public async findById(id: number): Promise<UrlEntityI | null> {
    const connection = await this.pool.getConnection();

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

  public async findByUrl(url: string): Promise<UrlEntityI | null> {
    const connection = await this.pool.getConnection();

    try {
      // FIXME: type
      const [result]: any = await connection.query(
        "SELECT id, url FROM urls WHERE url = ?",
        [url]
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
