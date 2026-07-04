import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString
});

if (!connectionString) {
    console.warn('DATABASE_URL is not defined. PostgreSQL connection is disabled.');
}

pool.on('connect', () => {
    console.log('PostgreSQL Connected');
});

pool.on('error', (err) => {
    console.error('PostgreSQL Error:', err);
});

// Function to establish and test the database connection
export const connectDB = async () => {
    if (!connectionString) {
        console.warn('Skipping database connection test because DATABASE_URL is missing.');
        return;
    }

    try {
        console.log('Attempting to connect to PostgreSQL...');
        const client = await pool.connect();
        console.log('Database connection established successfully');
        client.release();
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        throw err;
    }
};

// Function to query the database
export const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        console.log('Query executed successfully');
        return res;
    } catch (err) {
        console.error('Query error:', err);
        throw err;
    } finally {
        client.release();
    }
};

export default pool;
