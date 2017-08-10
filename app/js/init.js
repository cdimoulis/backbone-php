this.App = new Application({

  initialize: function() {
		//***************************
		// APP FEATURES
		//***************************

		// Spinner
		this.Spinner = new Spinner();
		// Snackbar
		this.Snackbar = new Snackbar();
		//***************************
		// END APP FEATURES
		//***************************
  },

  ready: function() {
		this._prefetch();
		var $body = $('body');
    var page = new this.Page({el: $body, data: App.page_data});
  },

  main: function() {
		// Turn off spinner
		this.Spinner.off();
  },

	_prefetch: function() {
  
	},
});
