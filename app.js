var express = require('express');
var path = require('path');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var router = require('./routes');
var db = require('./models');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));

app.use('/api',router);

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

db.connect()
  .then(function(){
    app.listen(1337);
  });
