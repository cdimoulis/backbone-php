/************

Expected data:
	model: model to get input value from and set input value to
	attribute: The attribute in the model that matches the input value (string)
	attributes: model for setting and changing element attributes
	enter_handler: Function to execute when enter is pressed

/***********/

App.View.extend({
  name: 'components/input/main',
  events: {
		'keyup': 'keyup',
		'input': '_setValue', // This event is for browser autocomplete evnets
  },
  init_functions: [
    'setup',
		'setupListeners',
		'setupAttributes',
  ],

  setup: function() {
    _.bindAll(this, 'modelChange', 'keyup', '_setValue');
		this.data.attributes = this.data.attributes || new App.Model();

    this.$el.val(this.data.model.get(this.data.attribute));
  },

	setupListeners: function() {
		this.listenTo(this.data.model, 'sync change:'+this.data.attribute, this.modelChange);
		this.listenTo(this.data.attributes, 'change', this.setupAttributes);
	},

	setupAttributes: function() {
		var _this = this;
		_.each(this.data.attributes.attributes, function(val, attr) {
			_this.$el.attr(attr, val);
		});
	},

  modelChange: function(model, val, opts) {
		// If not locally silent
		if (opts && !opts[this.name+'::silent']) {
    	this.$el.val(this.data.model.get(this.data.attribute));
		}
  },

	keyup: function(evt) {
		this._setValue();

		var keycode;
		if (evt) {
			keycode = evt.keyCode || evt.which;
			// If keycode is "enter" then callback
			if (keycode == 13) {
				if (!!this.data.enter_handler) {
					this.data.enter_handler(evt);
				}
			}
		}
	},

	_setValue: function() {
		// Pass components/input/main::silent = true to avoid issues
		var obj = {};
		obj[this.data.attribute] = this.el.value;
		opts = {};
		opts[this.name+'::silent'] = true
		this.data.model.set(obj,opts);
	},
});
