// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

module.exports = {
    development: {
        dialect: 'mysql',
        host: process.env.DB_SEQUELIZE_HOST,
        port: process.env.DB_SEQUELIZE_PORT,
        username: process.env.DB_SEQUELIZE_USERNAME,
        password: process.env.DB_SEQUELIZE_PASSWORD,
        database: process.env.DB_SEQUELIZE_DEVELOPMENT_DATABASE,
    },
    test: {
        dialect: 'mysql',
        host: process.env.DB_SEQUELIZE_HOST,
        port: process.env.DB_SEQUELIZE_PORT,
        username: process.env.DB_SEQUELIZE_USERNAME,
        password: process.env.DB_SEQUELIZE_PASSWORD,
        database: process.env.DB_SEQUELIZE_TEST_DATABASE,
    },
    production: {
        dialect: 'mysql',
        host: process.env.DB_SEQUELIZE_HOST,
        port: process.env.DB_SEQUELIZE_PORT,
        username: process.env.DB_SEQUELIZE_USERNAME,
        password: process.env.DB_SEQUELIZE_PASSWORD,
        database: process.env.DB_SEQUELIZE_PRODUCTION_DATABASE,
    }
};
