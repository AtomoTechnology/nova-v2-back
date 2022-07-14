const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');

// mongoose

app.listen(process.env.PORT, () => {
  console.log(`Server running on port : ${process.env.PORT}`);
  mongoose
    .connect(process.env.dbConnect, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log('DB CONNECTED SUCCESSFULLY');
    });
  // sequelize.sync({ alter: true }).then(() => console.log('sync complete'));
  // sequelize
  //   .authenticate()
  //   .then(() => {
  //     console.log('Connection has been established successfully.');
  //   })
  //   .catch((error) => {
  //     console.error('Unable to connect to the database:', error);
  //   });
});

module.exports = app;
