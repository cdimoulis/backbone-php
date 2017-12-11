/*
 The view is intended to control a certain section of the page. Views can have
 children views that are responsible for more specific sections.

See /app/js/views/example for some example views
Options:
  name: Required. The name of the view. Should match the route of its handlebars
    template
  init_functions: an array of function names to execute on initialization. Functions
    will execute in the order of the array.
  children: an object to represent child views. Each value in the object Should
    itself be an object with {
      view: the name of the child view,
      selector: the selector to attch the view to,
      data: data being passed down to child view
    }
  attributes: an object for any attributes you want set on the view's element
  any other properties/functions.

  DO NOT USE THESE PROPERTIES WHEN EXTENDING VIEWS:
    parent, data

*/
Backbone.View = Backbone.View.extend({

  initialize: function(options) {
    // Maintain scope
    _.bindAll(this, '_processAttributes', '_processTemplate', '_processInitFunctions', '_processChildren', 'appendTo', 'addChild', 'removeChild', 'render');
    options = options || {};

    this._children = {};

    // set data passed in options to the view's data property
    if (_.has(options, 'data')) {
      this.data = options.data;
    }

    // Deep clone children, remove existing children reference, add new children reference
    // This fixes a problem due to the children property being low on the prototype chain
    // Without this child views on a same view would end up with the same data object.
    var temp_children = {}
    $.extend(true, temp_children, this.children);
    delete this.children;
    this.children = temp_children;

    // Set the parent to be directly accessible
    this.parent = options.parent;

    this._processAttributes();
    this._processInitFunctions();
    this._processTemplate();
  },

  // Process any attributes to be placed on the view's element
  _processAttributes: function() {
    var _this = this;
    _.each(this.attributes, function(val, attr) {
      // If the key is class then add class
      if (attr == 'class') {
        _this.$el.addClass(val);
      }
      // Otherwise treat as a basic attribute
      else {
        _this.$el.attr(attr, val);
      }
    });
  },

  // Find the template and compile
  _processTemplate: function() {
    var $template = $("[template-name='"+this.name+"']");
    if ($template.length) {
      this.template = Handlebars.compile($template.html());
    }
    this.render();
  },

  // execute the functions in init_functions property
  _processInitFunctions: function() {
    var _this = this;

    if (!_.isUndefined(this.init_functions) && !_.isNull(this.init_functions) &&
        !_.isEmpty(this.init_functions)){

      _.each(this.init_functions, function(func) {
        // Ensure that the function has been specified
        if (!_this[func] && !_.isFunction(_this[func])){
          throw 'View '+this.name+' does not contain function: '+func;
          return;
        }
        // Bind to maintian scope of the view's function
        _.bindAll(_this,func);
        // Execute
        _this[func].call(this);
      });
    }
  },

  // Ensure that the children property has required keys/values
  _processChildren: function() {
    var _this = this;
    if (!this.children || this.children.length == 0) {
      return;
    }

    _.each(this.children, function(obj, name) {
      // If no view was specified for a child
      if (!obj.view) {
        throw this.name+' MissingViewError: Child '+name+' needs a view.';
      }
      // If no selector was specified for a child
      if (!obj.selector) {
        throw this.name+' MissingViewError: Child '+name+' needs a selector.';
      }
      _this.addChild(obj.view, obj.selector, obj.data);
    });
  },

  appendTo: function(selector) {
    this.$el.appendTo(selector);
    return this;
  },

  // Do the work of creating the child views
  addChild: function(view_name, selector, data) {
    var view;
    // Check that the view exists in App.Views
    if (!_.has(App.Views, view_name)) {
      throw "MissingViewError: "+view_name+" is not a view";
    }

    // Jquery element to attach child view to
    var $selector = this.$el.find(""+selector);

    if (!!$selector.length) {
      view = new App.Views[view_name]({
        el: $selector,
        data: data,
        parent: this
      });
      this._children[view.cid] = view;
    }

    // Return the view so it can be used if desired
    return view;
  },

  removeChild: function(view) {
    if (_.has(this._children, view.cid)) {
      // view.remove();
      view.$el.empty();
      view.stopListening();
      delete this._children[view.cid];
      delete view
    }
  },

  removeAllChildren: function() {
    var _this = this;
    _.each(this._children, function(view, cid) {
      _this.removeChild(view);
    });
  },

  // Set the html of hte view
  render: function() {
    // Clear out children before redrawing
    this.removeAllChildren();

    // Process the template with the view's properties
    if (!!this.template) {
      this.$el.html(this.template(this));
    }
    this._processChildren();
    return this;
  }
})
