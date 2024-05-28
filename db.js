const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "Task Manager",
    password: "Hrithik0216",
    port: 1602,
});

module.exports = pool;
