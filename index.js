const express = require('express');
const app = require('./server');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const HandleGlobalError = require('./controllers/errorController');

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.json({ limit: '220mb' }));
app.use(bodyParser.urlencoded({ limit: '220mb', extended: true }));
app.use(express.json());
app.use(helmet());

app.use('/api/v2/banners', require('./router/bannerRoute'));
app.use('/api/v2/expenses', require('./router/expensesRoute'));
app.use('/api/v2/states', require('./router/stateRoute'));
app.use('/api/v2/users', require('./router/userRoute'));
app.use('/api/v2/works', require('./router/workRoute'));
// app.use('/api/v2/queries', require('./router/queryRoute'));
app.use('/api/v2/sales', require('./router/saleRoute'));
app.use('/api/v2/sells', require('./router/sellsRoute'));
app.use('/api/v2/products', require('./router/productRoute'));

app.use('*', (req, res, next) => {
  res.status(500).json({
    ok: false,
    msg: `esta ruta : ${req.originalUrl} no existe`,
  });
  next();
});

app.use(HandleGlobalError);
