const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à MySQL réussie via Sequelize !');
    } catch (error) {
        console.error('❌ Impossible de se connecter à la base de données :', error);
    }
}

testConnection();

module.exports = sequelize;