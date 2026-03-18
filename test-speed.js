const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://postgres:Best_Dev_Ever_Is_Benly@localhost:5432/edpst",
});

async function test() {
    const start = Date.now();
    console.log("Testing DB Queries...");
    try {
        const res = await pool.query('SELECT count(*) FROM "Post"');
        console.log("Post count:", res.rows[0].count);
        console.log("Time taken:", Date.now() - start, "ms");
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await pool.end();
    }
}

test();
