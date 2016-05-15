var _base = require('./_base'),
	renderer = require('../renderer'),
	meals = require('./meals');

module.exports = {

	start: function(db){
		_base.start.bind(this)(db, 'plans');
	},

	index: function(req, res){
		_base.index.bind(this)({}, 'date', -1)
			.then(function(plans){
				renderer.render(req, res, 'plans', {plans: plans});
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	get: function(req, res){
		this._get(req.params.id)
			.then(function(plan){
				renderer.render(req, res, 'plan', {plan: plan});
			}, function(err){
				console.log(err.stack);
				renderer.render(req, res, 'error');
			});
	},

	generate: function(req, res){
		var self = this,
			promises = [];

		for(var i=0; i<7; i++){
			promises.push(meals.getRandom('lunch'));
			promises.push(meals.getRandom('dinner'));
		}

		Promise.all(promises)
			.then(function(meals){
				var days = [];

				for(var i=0; i<meals.length; i+=2){
					days.push({
						lunchId: meals[i]._id,
						dinnerId: meals[i+1]._id
					});
				}

				return _base.create.bind(self)({days: days});
			})
			.then(function(plan){
				res.redirect('/plans/' + plan._id.toString());
			})
			.catch(function(err){
				console.log(err.stack);
				renderer.render(req, res, 'error');
			});
	},

	generateOne: function(req, res){
		var self = this,
			day = req.query.day,
			type = req.query.type,
			meal;

		meals.getRandom(type)
			.then(function(_meal){
				meal = _meal;
				return _base.getOne.bind(self)(req.params.id);
			})
			.then(function(plan){
				var days = plan.days;
				days[day][type + 'Id'] = meal._id;
				return _base.update.bind(self)(plan._id, {
					days: days
				});
			})
			.then(function(plan){
				res.redirect('/plans/' + plan._id.toString());
			})
			.catch(function(err){
				console.log(err.stack);
				renderer.render(req, res, 'error');
			});
	},

	removeOne: function(req, res){
		var self = this,
			day = req.query.day,
			type = req.query.type,
			meal;

		_base.getOne.bind(self)(req.params.id)
			.then(function(plan){
				var days = plan.days;
				days[day][type + 'Id'] = null;
				return _base.update.bind(self)(plan._id, {
					days: days
				});
			})
			.then(function(plan){
				res.redirect('/plans/' + plan._id.toString());
			})
			.catch(function(err){
				console.log(err.stack);
				renderer.render(req, res, 'error');
			});
	},

	removeConfirmation: function(req, res){
		this._getAndRender.bind(this)(req, res, 'delete-plan');
	},

	remove: function(req, res){
		_base.remove.bind(this)(req.params.id)
			.then(function(){
				renderer.render(req, res, 'delete-plan-success');
			}, function(err){
				renderer.render(req, res, 'error');
			});
	},

	mealOptions: function(req, res){
		var plan;

		_base.getOne.bind(this)(req.params.id)
			.then(function(_plan){
				plan = _plan;
				return _base.index.bind(meals)({type: req.query.type});
			})
			.then(function(mealOptions){
				renderer.render(req, res, 'plan-change-meal', {
					meals: mealOptions,
					day: req.query.day,
					type: req.query.type,
					plan: plan
				});
			}, function(err){
				renderer.render(req, res, 'error');
			})
	},

	changeMeal: function(req, res){
		var self = this,
			day = req.body.day,
			type = req.body.type,
			mealId = req.body.mealId;

	_base.getOne.bind(this)(req.params.id)
			.then(function(plan){
				var days = plan.days;
				days[day][type + 'Id'] = mealId;
				return _base.update.bind(self)(plan._id, {
					days: days
				});
			})
			.then(function(plan){
				res.redirect('/plans/' + plan._id.toString());
			})
			.catch(function(err){
				console.log(err.stack);
				renderer.render(req, res, 'error');
			});
	},

	ingredients: function(req, res){
		this._get(req.params.id)
			.then(function(plan){
				var ingredients = [];

				plan.days.forEach(function(day){
					if(day.lunch){
						ingredients = ingredients.concat(day.lunch.ingredients);
					}
					if(day.dinner){
						ingredients = ingredients.concat(day.dinner.ingredients);
					}
				});

				renderer.render(req, res, 'plan-ingredients', {ingredients: ingredients});
			})
			.catch(function(err){
				console.log(err.stack);
				renderer.render(req, res, 'error');
			});
	},

	_get: function(id){
		var plan;

		return _base.getOne.bind(this)(id)
			.then(function(_plan){
				plan = _plan;
				var promises = [];

				plan.days.forEach(function(day){
					if(day.lunchId){
						promises.push(meals.getOne(day.lunchId));
					}
					else{
						promises.push(null);
					}
					if(day.dinnerId){
						promises.push(meals.getOne(day.dinnerId));
					}
					else{
						promises.push(null);
					}
				});

				return Promise.all(promises);
			})
			.then(function(meals){
				plan.days = [];

				for(var i=0; i<meals.length; i+=2){
					plan.days.push({
						lunch: meals[i],
						dinner: meals[i+1]
					});
				}

				return plan;
			});
	},

	_getAndRender: function(req, res, templateName){
		_base.getOne.bind(this)(req.params.id)
			.then(function(plan){
				if(plan){
					renderer.render(req, res, templateName, {plan: plan});
				}
				else{
					renderer.render(req, res, '404');
				}
			}, function(err){
				renderer.render(req, res, 'error');
			});
	}

}
