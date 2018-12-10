const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let middleware = require('./auth/AuthController');
const HandlerGenerator = require('./auth/HandlerGenerator');
const handlers = new HandlerGenerator();
var cors = require('cors');

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(bodyParser());
// app.use(bodyParser.urlencoded({ extended: false })); data phai la x-www-form-urlencoded

app.post('/login', handlers.login);

app.get('/logout', middleware, handlers.logout);
app.get('/getUser', middleware, handlers.getUser);

app.get('/', middleware, handlers.index);

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});
