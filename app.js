var PORT = 8000;

var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var queryString = require('querystring');
var http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.set('view engine', 'jade');
app.set('views', __dirname + '/public');
app.use(express.static('public'));

app.get('/', function(req, res){
		res.render('index.jade', {submitted: false});
});

app.get('/yo', function(req, res){
	console.log('received yo from ' + req.param('username'));
});

app.post('/', function(req, res){
		console.log('received user: ' + req.body.user);
		console.log('received group: ' + req.body.group);

		var data = queryString.stringify({
				api_token: '2a66720c-965e-2b6a-0317-98d2266e3c4a',
				username: req.body.user,
		});

		var options = {
				host: 'api.justyo.co',
				port: 80,
				path: '/yo',
				method: 'POST',
				headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': Buffer.byteLength(data),
				},
		};

		var req = http.request(options, function(res){
				res.setEncoding('utf8');
				res.on('data', function(chunk){
						console.log('body: ' + chunk);
				});
		});

		console.log(req);

		req.write(data);
		req.end();

		res.render('index.jade', {submitted: true});
});

var userCollection;

MongoClient.connect('mongodb://127.0.0.1:27017', function(err, db){
		console.log('connected to database');
		userCollection = db.collection('users');
});

app.listen(PORT, function(){
		console.log('node server listening on port ' + PORT);
});
