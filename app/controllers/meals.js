var mongod = require('mongod'),
	renderer = require('../renderer'),
	db;

module.exports = {

	start: function(_db){
		db = _db;
	},

	create: function(req, res){
		var body = this._filter(req.body);

		body.date = new Date();

		db.meals.save(body)
			.then(function(){
				renderer.render(req, res, 'add-meal-success');
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	update: function(req, res){
		var body = this._filter(req.body);

		db.meals.findAndModify({
			query: {
				_id: mongod.ObjectId(req.params.id)
			},
			update: body
		})
		.then(function(){
			renderer.render(req, res, 'edit-meal-success');
		}, function(err){
			renderer.render(req, res, 'error');
		});
	},

	_filter: function(body){
		body.ingredients = body.ingredients.filter(function(ingredient){
			return !!ingredient.name;
		});

		body.method = body.method.filter(function(step){
			return !!step;
		});

		return body;
	},

	index: function(req, res){
		db.meals.find({})
			.then(function(meals){				
				renderer.render(req, res, 'meals', {meals: meals});
			}, function(err){
				renderer.render(req, res, 'error');
			});		
	},

	get: function(req, res){
		this._getAndRender(req, res, 'meal');	
	},

	edit: function(req, res){
		this._getAndRender(req, res, 'edit-meal');	
	},

	deleteConfirmation: function(req, res){
		this._getAndRender(req, res, 'delete-meal');
	},

	delete: function(req, res){
		db.meals.remove({
			_id: mongod.ObjectId(req.params.id)
		})
		.then(function(){
			renderer.render(req, res, 'delete-meal-success');
		}, function(err){
			renderer.render(req, res, 'error');
		});
	},

	_getAndRender: function(req, res, templateName){
		db.meals.findOne({
			_id: mongod.ObjectId(req.params.id)
		})
		.then(function(meal){
			if(meal){
				renderer.render(req, res, templateName, {meal: meal});
			}
			else{
				renderer.render(req, res, '404');
			}
		}, function(err){
			renderer.render(req, res, 'error');
		});
	}

};