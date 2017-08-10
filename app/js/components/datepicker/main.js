/************

Expected data:
	model: model to get input value from and set input value to
	attribute: The attribute in the model that matches the input value
	max_date: The maximum date allowed
	min_date: The miminum date allowed
	attributes: model for setting and changing element attributes

/***********/

App.View.extend({
  name: 'components/datepicker/main',
  events: {
    'change': 'onChange',
  },
  init_functions: [
    'setup',
		'setupListeners',
		'setupAttributes',
  ],

  setup: function() {
    _.bindAll(this, 'modelChange', 'onChange');
		var _this = this;
		this.data.attributes = this.data.attributes || new App.Model();

		this.local = {
			original_date: this.data.model.get(this.data.attribute),
		}

		this.$el.attr('placeholder', 'Select a date');
    this.$el.val(this.data.model.get(this.data.attribute));

		// Build year range
		var yearRange = '';
		// If there is a min date then use that year for the min year
		// Default current year - 100 years
		this.data.min_date instanceof Date ? yearRange+=this.data.min_date.getFullYear() : yearRange+= (new Date).getFullYear()-150
		yearRange += ':'
		// If there is a max date then use that year for the max year
		// Default current year + 100 years
		this.data.max_date instanceof Date ? yearRange+=this.data.max_date.getFullYear() : yearRange+= (new Date).getFullYear()+150

		this.$el.datepicker({
			changeMonth: true,
			changeYear: true,
			minDate: this.data.min_date,
			maxDate: this.data.max_date,
			defaultDate: new Date(this.local.original_date),
			yearRange: yearRange,
			// Validate the date strig
			onClose: function(val,dp) {
				// Check date validity
				// See moment.js
				m = moment(val, "MM/DD/YYYY", true);
				if (!m.isValid()) {
					$(this).val(_this.local.original_date);
				}
				else {
					_this.local.original_date = m.format("MM/DD/YYYY")
					_this.data.model.set(_this.data.attribute, m.format("MM/DD/YYYY"))
				}
			},
		});
  },

	setupListeners: function() {
		this.listenTo(this.data.model, 'change:'+this.data.attribute, this.modelChange);
		this.listenTo(this.data.attributes, 'change', this.setupAttributes);
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
