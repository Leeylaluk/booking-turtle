import mysql from 'mysql2';

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gannex-qickyk-xeppy6',
    database: 'v5'
});

connection.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }
    console.log(' MySQL connected successfully');
});