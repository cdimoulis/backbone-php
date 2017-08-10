this.Spinner = function(options) {
	options = options || {};

	/**********
	/ PUBLIC FUNCTIONS
	/**********/
	// Turn on the spinner
	// show_verse true means verse text will be visible
	this.on = function(text) {
		if (text) {
			var $text = $('#spinner-text');
			// If App and app cache exist and have the loading verses
			if ($text.length) {
				$text.html(text);
			}
			$text.removeClass('hidden');
		}
		var $spinner_wrapper = $('#spinner-wrapper');
		var $spinner = $('#spinner-wrapper #spinner i');
		if ($spinner_wrapper.length && $spinner.length) {
			$spinner_wrapper.removeClass('hidden');
			$spinner.addClass('fa-pulse');
		}
	};

	// Turn off the spinner
	this.off = function() {
		options.on = false;
		var $text = $('#spinner-text');
		$text.empty();
		var $spinner_wrapper = $('#spinner-wrapper');
		var $spinner = $('#spinner-wrapper #spinner i');
		var $text = $('#spinner-text');
		if ($spinner_wrapper.length && $spinner.length) {
			$spinner_wrapper.addClass('hidden');
			$spinner.removeClass('fa-pulse');
			$text.addClass('hidden');
		}
	};

	/**********
	/ END PUBLIC FUNCTIONS
	/**********/

	/**********
	/ PRIVATE FUNCTIONS
	/**********/
	// Setup the elemends on the DOM
	this._setDom = function() {
		var _this = this;
		var $body = $('body');
		// If the DOM is ready
		if ($body.length > 0){
			// Add Spinner if not in DOM already
			if ($('#spinner-wrapper').length == 0) {
				var $outer_wrapper = $('<div id="spinner-wrapper">');
				var $inner_wrapper = $('<div id="spinner-inner-wrapper">');
				var $spinner = $('<div id="spinner">');
				var $icon = $('<i class="fa fa-5x fa-spinner fa-pulse">');
				var $text = $('<div id="spinner-text">');
				$spinner.append($icon);
				$inner_wrapper.append($spinner);
				$inner_wrapper.append($text);
				$outer_wrapper.append($inner_wrapper);
				$body.append($outer_wrapper);

				// If not on from initialization then hide
				if (!options.on) {
					$outer_wrapper.addClass('hidden');
					$text.addClass('hidden');
				}
			}
		}
		else {
			// DOM is not ready to call when ready
			$(function() {
				_this._setDom()
			});
		}
	};

	/**********
	/ END PRIVATE FUNCTIONS
	/**********/

	// Setup DOM
	this._setDom();
};
