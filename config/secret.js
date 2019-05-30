const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    database:process.env.DATABASE_URL,
    authDatabase:process.env.AUTH_DATABASE_NAME,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    paystackKey:process.env.PAYSTACK_KEY,
    elasticSearchUrl:process.env.ELASTIC_SEARCH_URL,
    databaseUsername:process.env.DATABASE_USERNAME,
    databasePassword:process.env.DATABASE_PASSWORD,
    nodeEnv:process.env.NODE_ENV
};
