var mongod = require('mongod'),
	renderer = require('../renderer');

var base = {

  start: function(db, collectionName){
    this.collection = db.collection(collectionName);
  },

  create: function(data){
    if(this._filter){
      data = this._filter(data);
    }
    data.date = new Date();
    return this.collection.save(data);
  },

  update: function(id, data){
    if(this._filter){
      data = this._filter(data);
    }

    return this.collection.findAndModify({
			query: {
				_id: mongod.ObjectId(id)
			},
			update: {
				$set: data
			},
			new: true
		});
  },

  remove: function(id){
    return this.collection.remove({
			_id: mongod.ObjectId(id)
		});
  },

  index: function(query, sortBy, sortDirection){
    query = query || {};

    var cursor = this.collection.find(query);

    if(sortBy){
      var sort = {};
      sort[sortBy] = sortDirection;
      cursor.sort(sort);
    }

    return cursor;
  },

  getOne: function(id){
    return this.collection.findOne({
      _id: mongod.ObjectId(id)
    });
  }

};

module.exports = base;
