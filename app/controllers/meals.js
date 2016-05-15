var _base = require('./_base'),
	renderer = require('../renderer'),
	utils = require('../utils');

module.exports = {

	start: function(db){
		_base.start.bind(this)(db, 'meals');
	},

	create: function(req, res){
		_base.create.bind(this)(req.body)
			.then(function(){
				renderer.render(req, res, 'add-meal-success');
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	update: function(req, res){
		_base.update.bind(this)(req.params.id, req.body)
			.then(function(){
				renderer.render(req, res, 'edit-meal-success');
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	index: function(req, res){
		_base.index.bind(this)()
			.then(function(meals){
				renderer.render(req, res, 'meals', {meals: meals});
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	remove: function(req, res){
		_base.remove.bind(this)(req.params.id)
			.then(function(){
				renderer.render(req, res, 'delete-meal-success');
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	get: function(req, res){
		this._getAndRender.bind(this)(req, res, 'meal');
	},

	edit: function(req, res){
		this._getAndRender.bind(this)(req, res, 'edit-meal');
	},

	removeConfirmation: function(req, res){
		this._getAndRender.bind(this)(req, res, 'delete-meal');
	},

	getRandom: function(type){
		var self = this;

		return new Promise(function(resolve, reject){
			var cursor = _base.index.bind(self)({type: type});

			cursor.count()
				.then(function(count){
					return cursor.limit(-1).skip(utils.random(0, count-1));
				})
				.then(function(meals){
					resolve(meals[0]);
				})
				.catch(reject);

		});
	},

	getOne: function(id){
		return _base.getOne.bind(this)(id);
	},

	_getAndRender: function(req, res, templateName){
		_base.getOne.bind(this)(req.params.id)
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
	},

	_filter: function(data){
		data.ingredients = data.ingredients.filter(function(ingredient){
			return !!ingredient.name;
		});

		data.method = data.method.filter(function(step){
			return !!step;
		});

		return data;
	}

}
