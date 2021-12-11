const db = require('./db');
const auth = require('./auth');

async function createUser(name, surname, email, mobile, password) {
    auth.bcrypt.hash(password, auth.saltRounds, function (err, hash) {
        db.query(
            'INSERT INTO users(name, surname, email, mobile, password, registeredat, is_admin) VALUES ($1, $2, $3, $4, $5, now(), false);', 
            [name, surname, email, mobile, hash]
            );
    })
}

module.exports = {
    createUser
}