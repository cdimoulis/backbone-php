this.App = new Application({

  initialize: function() {

  },

  ready: function() {
		var $body = $('body');
    var page = new this.Page({el: $body, data: App.page_data});
  },

  main: function() {

  },

	_prefetch: function() {

	},
});
