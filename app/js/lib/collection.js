Backbone.Collection = Backbone.Collection.extend({
	_baseURL: "/includes/ajax",

  url: function(folder="default", file) {
		if (!!file) {
			return this._baseURL+"/"+folder+"/"+file;
		}
		else {
			return this._baseURL+"/"+folder+"/";
		}
  },

  toJSON: function() {
    var name = this['name'].toUnderscore().toLowerCase();
    var obj = {};
    var models = this.map( function(model) {
      var np = model.nestedParams;
      model.nestedParams = false;
      m = model.toJSON();
      model.nestedParams = np;
      return m;
    });

    obj[name] = models;
    return obj;
  },

	customSave: function(file, options) {
		options || (options = {});
		var name = this.name.toUnderscore().toLowerCase();
		options.url = this.url(name,file);

		this.save(this.attributes, options)
	},

	_customFetch: function(file, options) {
		options || (options = {});
		var name = this.name.toUnderscore().toLowerCase();
		options.url = this.url(name,file);

		this.fetch(options)
	},

	// Need to override model fetch so that we can add some GET params
	// Server needs 1 extra param:
	// 	table_name: the name of the table (model)
	fetch: function(options) {
		options = _.extend({parse: true}, options);
		options = this._paramBuilder(options);
    var success = options.success;
    var collection = this;
		var name = this.name;
    options.success = function(resp) {
      var method = options.reset ? 'reset' : 'set';
			models = resp[name.toUnderscore().toLowerCase()];
      collection[method](models, options);
      if (success) success.call(options.context, collection, resp, options);
      collection.trigger('sync', collection, resp, options);
    };
    wrapError(this, options);
    return this.sync('read', this, options);
  },

	_paramBuilder: function(options) {
		var data = {};

		if (!!this.name) {
			data.table_name = this.name.toUnderscore().toLowerCase();
		}

		options.data = _.extend(data, options.data);
		return options;
	},
});

var wrapError = function(collection, options) {
	var error = options.error;
	options.error = function(resp) {
		if (error) error.call(options.context, collection, resp, options);
		collection.trigger('error', collection, resp, options);
	};
};
