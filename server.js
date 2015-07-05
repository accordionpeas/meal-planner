__rootDir = __dirname;

var express = require('express'),
	bodyParser = require('body-parser'),
	mongod = require('mongod'),
	swig = require('swig'),

	app = express(),
	server = require('http').createServer(app),
	db = mongod('mongodb://localhost/meal-planner', ['meals', 'plans']);
	port = 3000 || process.env.PORT;

swig.setDefaults({
	cache: false
});

app.use(express.static(__dirname + '/app/static'));
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/controllers/meals').start(db);
require('./app/controllers/plans').start(db);

require('./app/router').start(app);

server.listen(port);

console.log('Listening on port ' + port);