const express = require('express');
const routes = require('./controller/bookController');

const app = express();

app.use(express.json());

app.use('/', routes);

app.listen(4000, ()=>console.log('http-server is running'));