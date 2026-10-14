import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseModel {
    private _config: pg.PoolConfig;
    private _pool: pg.Pool;

    constructor() {
        const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

        // Se houver uma URL completa de conexão (comum no Render / Supabase)
        if (process.env.DATABASE_URL) {
            this._config = {
                connectionString: process.env.DATABASE_URL,
                ssl: isProduction ? { rejectUnauthorized: false } : false,
                max: 10,
                idleTimeoutMillis: 10000
            };
        } else {
            // Caso prefira usar variáveis separadas
            this._config = {
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
                ssl: isProduction ? { rejectUnauthorized: false } : false,
                max: 10,
                idleTimeoutMillis: 10000
            };
        }

        this._pool = new pg.Pool(this._config);
    }

    public async testeConexao() {
        try {
            // Testamos a conexão usando a própria pool
            const client = await this._pool.connect();
            console.log('Database connected!');
            client.release(); // Libera o cliente de volta para a pool
            return true;
        } catch (error) {
            console.log('Error to connect database X(');
            console.log(error);
            return false;
        }
    }

    public get pool() {
        return this._pool;
    }
}