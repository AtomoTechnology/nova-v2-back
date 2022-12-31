const express = require('express');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();
app.listen(process.env.PORT, () => {
  console.log(`Server running on port : ${process.env.PORT} : MODE :  ${process.env.NODE_ENV}`);
});

module.exports = app;
