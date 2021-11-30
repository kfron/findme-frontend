const db = require('./db');
const config = require('../config');

async function getAdsList() {
    const data = await db.query(
        'SELECT * FROM ads;'
    );

    return data;
}

async function getAd(id) {
    const data = await db.query(
        'SELECT * FROM ads WHERE id = $1;',[id]
    );

    return data;
}

module.exports = {
    getAdsList,
    getAd
}