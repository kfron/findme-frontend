const db = require('./db');
const config = require('../config');

async function getAdsList() {
    const data = await db.query(
        'SELECT * FROM users;'
    );

    return data;
}

module.exports = {
    getAdsList
}