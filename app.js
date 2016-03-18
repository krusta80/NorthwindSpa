var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var router = require('./routes');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));

app.use('/api',router);

app.get('/', function(req,res) {
	res.redirect('/index.html');
})

app.listen(1337);
