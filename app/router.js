var renderer = require('./renderer'),
	meals = require('./controllers/meals'),
	plans = require('./controllers/plans');

module.exports = {

	start: function(app){
		
		app

			.all('*', function(req, res, next){
				res.header('content-type', 'text/html');
				next();
			})

			.get('/meals', function(req, res){
				meals.index(req, res);
			})

			.get('/meals/create', function(req, res){
				renderer.render(req, res, 'add-meal');
			})

			.get('/meals/:id/edit', function(req, res){
				meals.edit(req, res);
			})

			.post('/meals/:id/edit', function(req, res){
				meals.update(req, res);
			})

			.get('/meals/:id/delete', function(req, res){
				meals.deleteConfirmation(req, res);
			})

			.post('/meals/:id/delete', function(req, res){
				meals.delete(req, res);
			})

			.get('/meals/:id', function(req, res){
				meals.get(req, res);
			})

			.post('/meals/create', function(req, res){
				meals.create(req, res);
			})

			.get('/', function(req, res){
				renderer.render(req, res, 'home');
			})

			.get('*', function(req, res){
				res.status(404);
				renderer.render(req, res, '404');
			});
	}

};