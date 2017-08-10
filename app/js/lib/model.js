Backbone.Model = Backbone.Model.extend({
	nestedParams: true,
	_baseURL: "/includes/ajax",

  url: function(folder="default", file, url_params) {
		var _url;
		if (!!file) {
			_url = this._baseURL+"/"+folder+"/"+file;
		}
		else {
			_url = this._baseURL+"/"+folder+"/";
		}

		if (!!url_params) {
			_url += "?"+$.param(url_params);
		}

		return _url;
  },

  toJSON: function() {
    var name = this['name'].toUnderscore().toLowerCase();
    var obj = {};
		var attrs = _.clone(this.attributes);
		delete attrs[this.idAttribute];

		// Set id and id_value per Jason's server side needs :)
		attrs.id_value = this.id;
		attrs.id = this.idAttribute;

    if (!_.isUndefined(name) && this.nestedParams) {
			// Array attrs for saving convention
      obj[this['name'].toUnderscore()] = [attrs];
    }
    else {
      obj = attrs;
    }

    return obj;
  },

	customSave: function(file, options) {
		options || (options = {});
		var name = this.name.toUnderscore().toLowerCase();
		options.url = this.url(name,file);

		return this.save(this.attributes, options)
	},

	// Need to override model fetch so that we can add some GET params
	// Server needs 3 extra params:
	// 	table_name: the name of the table (model)
	// 	id: The name of the id attribute
	// 	id_value: The value of the id attribute
	fetch: function(options) {
		options = _.extend({parse: true}, options);
		options = this._paramBuilder(options);
		var model = this;
		var success = options.success;
		options.success = function(resp) {
			var name = model.name.toUnderscore().toLowerCase();
			var attrs = resp[name][0];
		  var serverAttrs = options.parse ? model.parse(attrs, options) : attrs;
		  if (!model.set(serverAttrs, options)) return false;
		  if (success) success.call(options.context, model, resp, options);
			model.trigger('sync', model, resp, options);
		};
		wrapError(this, options);
		return this.sync('read', this, options);
  },

	// Need to override part of the default backbone save
	// Default saves sets returned params to model. This is not
	// behavior that fits with our current convention.
	// SEE COMMENTED CODE BELOW FOR CHANGES
	save: function(key, val, options) {
		if(this.isValid()){
			// Handle both `"key", value` and `{key: value}` -style arguments.
			var attrs;
			if (key == null || typeof key === 'object') {
			  attrs = key;
			  options = val;
			} else {
			  (attrs = {})[key] = val;
			}

			options = _.extend({validate: true, parse: true}, options);
			var wait = options.wait;

			// If we're not waiting and attributes exist, save acts as
			// `set(attr).save(null, opts)` with validation. Otherwise, check if
			// the model will be valid when the attributes, if any, are set.
			if (attrs && !wait) {
			  if (!this.set(attrs, options)) return false;
			} else if (!this._validate(attrs, options)) {
			  return false;
			}

			// After a successful server-side save, the client is (optionally)
			// updated with the server-side state.
			var model = this;
			var success = options.success;
			var error = options.error;
			var attributes = this.attributes;
			delete model.errors;
			options.success = function(resp) {
			  // Ensure attributes are restored during synchronous saves.
				var build_attrs = model._attrBuilder(resp);
			  model.attributes = attributes;

				/**
				* The following has been altered to fit our server's response convention
				* Since error codes are not necessarily set error will be triggered if
				* the response contains an errors key
				**/
				if (!_.has(build_attrs, 'error')) {
				  var serverAttrs = options.parse ? model.parse(build_attrs, options) : build_attrs;
				  if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
				  if (serverAttrs && !model.set(serverAttrs, options)) return false;
				  if (success) success.call(options.context, model, build_attrs, options);
				  model.trigger('sync', model, build_attrs, options);
				}
				else {
					model.error = build_attrs.error;
					if (error) error.call(options.context, model, build_attrs, options);
					model.trigger('error', model, build_attrs, options);
				}
			};
			wrapError(this, options);
			// Set temporary attributes if `{wait: true}` to properly find new ids.
			if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

			var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
			if (method === 'patch' && !options.attrs) options.attrs = attrs;
			var xhr = this.sync(method, this, options);

			// Restore attributes.
			this.attributes = attributes;

			return xhr;
		}
		return false;
	},

	destroy: function(options) {
    options = options ? _.clone(options) : {};
		options.url = this.url("default", null, this._destroyParams());
    var model = this;
    var success = options.success;
    var wait = options.wait;

    var destroy = function() {
      model.stopListening();
      model.trigger('destroy', model, model.collection, options);
    };

    options.success = function(resp) {
      if (wait) destroy();
      if (success) success.call(options.context, model, resp, options);
      if (!model.isNew()) model.trigger('sync', model, resp, options);
    };

    var xhr = false;
    if (this.isNew()) {
      _.defer(options.success);
    } else {
      wrapError(this, options);
      xhr = this.sync('delete', this, options);
    }
    if (!wait) destroy();
    return xhr;
  },

	isValid: function() {
		return true;
	},

	_destroyParams: function() {
		var data = {params: this.toJSON()};

		return data;
	},

	// Build the GET params based on our convention
	// id = the name of the id (look up) attribute
	// id_value = the actual "id" value
	_paramBuilder: function(options) {
		var data = {};
		// If there is a where then use that for the attribute
		var attr = _.has(options, 'where') ? options.where.attribute : this.idAttribute;
		// In case there is a where object, but no attribute value exists
		attr = attr || this.idAttribute;

		if (!!this.name) {
			data.table_name = this.name.toUnderscore().toLowerCase();
		}

		if (this.has(attr)) {
			data.id = attr;
			data.id_value = this.get(attr);
		}

		options.data = _.extend(data, options.data);
		return options;
	},

	// Build model attributes after a save based on our convention
	// Since we send id and id_value (see comment above) then we will
	// be receiving these back. This will set the attributes back to having
	// the proper id attribute name and value in the model
	_attrBuilder: function(resp) {
		var name = this.name.toUnderscore().toLowerCase();
		var attrs = resp[name][0];

		if (!attrs) {
			return {};
		}

		var model_attrs = _.clone(attrs);
		delete model_attrs.id;
		delete model_attrs.id_value;
		var id_name = this.idAttribute || attrs.id;

		if (!!id_name && _.has(attrs, 'id_value')) {
			model_attrs[id_name] = attrs.id_value;
		}

		return model_attrs;
	},
});


var wrapError = function(model, options) {
	var error = options.error;
	options.error = function(resp) {
		if (error) error.call(options.context, model, resp, options);
		model.trigger('error', model, resp, options);
	};
};
