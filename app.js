var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var router = require('./routes');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use('/api',router);

app.get('/', function(req,res) {
	res.redirect('/public/index.html');
})

app.listen(1337);
