const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    database:process.env.DATABASE_URL,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY
};