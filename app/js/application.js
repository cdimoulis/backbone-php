this.Application = function(options) {

  var _this = this;

	//***************************
	// IMPORTANT APP SETUP
	//***************************
  this.Root = '/alf/inventory';

  this.Models = {};
  this.Collections = {};
  this.Views = {};
  // this.Page = null;

  this.Model = Backbone.Model;
  this.Collection = Backbone.Collection;
  this.View = Backbone.View;
  this.Page = this.View.extend({
  });

	this.page_data = {};

  /*****
  * Adjust the extend function of backbone's classes
  * This change will allow the Application object to
  * store all the created classes (i.e. models, collections, views)
  ******/
  var _registerClass = function (cls, hash) {
    cls_extend = cls.extend;
    cls.extend = function () {
      child = cls_extend.apply(this, arguments);
      if (child.prototype.name){
        hash[child.prototype.name] = child;
      }
      return child;
    }
  };

  _registerClass(this.Model, this.Models);
  _registerClass(this.Collection, this.Collections);
  _registerClass(this.View, this.Views);

  // Register the page view
  page_extend = this.Page.extend;
  this.Page.extend = function() {
    _this.Page = page_extend.apply(this, arguments);
  }
  /*********
  * END REGISTER
  **********/

  _.extend(this, {
    initialize: function() {
      return null;
    },
    ready: function() {
      return null;
    },
    main: function() {
      return null;
    }
  });

  _.extend(this, options);

  this.start = function() {
    // _this.initialize();
    _this.ready();
    _this.main();
  };

	// Start the app on ready
	$(function() {
		_this.start();
	});
	//***************************
	// END IMPORTANT APP SETUP
	//***************************



	// END OF APP
	this.initialize();
  return this;
};
