const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port : ${process.env.PORT}`);
});

module.exports = app;
