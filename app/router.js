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

			.get('/plans', function(req, res){
				plans.index(req, res);
			})

			.get('/plans/generate', function(req, res){
				plans.generate(req, res);
			})

			.get('/plans/:id', function(req, res){
				plans.get(req, res);
			})

			.get('/plans/:id/generateMeal', function(req, res){
				plans.generateOne(req, res);
			})

			.get('/plans/:id/changeMeal', function(req, res){
				plans.mealOptions(req, res);
			})

			.post('/plans/:id/changeMeal', function(req, res){
				plans.changeMeal(req, res);
			})

			.get('/plans/:id/removeMeal', function(req, res){
				plans.removeOne(req, res);
			})

			.get('/plans/:id/delete', function(req, res){
				plans.removeConfirmation(req, res);
			})

			.get('/plans/:id/ingredients', function(req, res){
				plans.ingredients(req, res);
			})

			.post('/plans/:id/delete', function(req, res){
				plans.remove(req, res);
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
				meals.removeConfirmation(req, res);
			})

			.post('/meals/:id/delete', function(req, res){
				meals.remove(req, res);
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
