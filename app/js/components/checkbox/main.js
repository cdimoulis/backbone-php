/************

Expected data:
	model: model to get input value from and set input value to
	attribute: The attribute in the model that matches the input value

/***********/

App.View.extend({
  name: 'components/checkbox/main',
  events: {
    'change': 'onChange',
  },
  init_functions: [
    'setup',
  ],

  setup: function() {
    _.bindAll(this, 'modelChange', 'onChange');

		var checked = !!this.data.model.get(this.data.attribute);
		if (checked) {
			this.$el.prop('checked', checked);
		}
		this.$el.attr('name', this.data.attribute);
		this.$el.attr('value',1);
    this.listenTo(this.data.model, 'change:'+this.data.attribute, this.modelChange);
  },

  modelChange: function(model, value) {
		this.$el.prop('checked', !!value);
  },

  onChange: function() {
		var val = this.$el.prop('checked') ? 1 : 0;
    this.data.model.set(this.data.attribute, val);
  },
});
