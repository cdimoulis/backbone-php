/************

Expected data:
	event_handler: Function to call when button is clicked

/***********/

App.View.extend({
  name: 'components/button/main',
  events: {
    'click': 'onClick',
  },
  init_functions: [
    'setup',
  ],

  setup: function() {
    _.bindAll(this, 'onClick');

  },

  onClick: function() {
    if (_.has(this.data, 'event_handler') && _.isFunction(this.data.event_handler)) {
      this.data.event_handler();
    }
  }
});
