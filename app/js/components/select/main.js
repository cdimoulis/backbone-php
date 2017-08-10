/************

Expected data:
	model: model to get and set selected val to
	attribute: The attribute in the model that matches the selected val
	options: collection of options. Models in collection hold data for options
	option_value: attribute in the options collection to get the value for an option
	option_text: attribute in the options collection to get the display text for an option
	placeholder: the text for a placeholder option
	attributes: model for setting and changing element attributes

/***********/

App.View.extend({
  name: 'components/select/main',
  events: {
    'change': 'onChange',
  },
  init_functions: [
    'setup',
		'setupListeners',
		'setupOptions',
		'setupAttributes',
  ],

  setup: function() {
    _.bindAll(this, 'modelChange', 'onChange');
		// Add attributes model if not existent
		this.data.attributes = this.data.attributes || new App.Model();

		this.display = {
			placeholder: this.data.placeholder || "Select",
			has_selected: false,
		}
  },

	setupListeners: function() {
		this.listenTo(this.data.model, 'change:'+this.data.attribute, this.modelChange);
		this.listenTo(this.data.attributes, 'change', this.setupAttributes);
		this.listenTo(this.data.options, 'sync', function(){
			this.setupOptions();
			this.render();
		});
		
	},

	setupOptions: function() {
		var _this = this;
		this.options = [];
		this.data.options.each(function(model) {
			option = {
				value: model.get(_this.data.option_value),
				text: model.get(_this.data.option_text),
			}
			if (option.value == _this.data.model.get(_this.data.attribute)) {
				option.selected = true;
				_this.display.has_selected = true;
			}
			_this.options.push(option);
		});
	},

	setupAttributes: function() {
		var _this = this;
		_.each(this.data.attributes.attributes, function(val, attr) {
			_this.$el.attr(attr, val);
		});
	},

  modelChange: function() {
    this.$el.val(this.data.model.get(this.data.attribute));
  },

  onChange: function() {
    this.data.model.set(this.data.attribute, this.el.value);
  }
});
