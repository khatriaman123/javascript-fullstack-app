const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tutorialdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('✅ Connection successful!'))
  .catch(err => console.error('❌ Unable to connect:', err));
