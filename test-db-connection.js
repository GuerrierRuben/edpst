const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://postgres:Best_Dev_Ever_Is_Benly@localhost:5432/edpst",
    connectionTimeoutMillis: 5000,
});

async function testConnection() {
    console.log("Testing connection...");
    try {
        const start = Date.now();
        await pool.query('SELECT 1');
        console.log(`Connection successful in ${Date.now() - start}ms`);
    } catch (err) {
        console.error("Connection failed:", err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
