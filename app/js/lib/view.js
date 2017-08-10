Backbone.View = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this, '_processAttributes', '_processTemplate', '_processInitFunctions', '_processChildren', 'appendTo', 'addChild', 'removeChild', 'render');
    options = options || {};

		this._children = {};

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

    this.parent = options.parent;

    this._processAttributes();
    this._processInitFunctions();
		this._processTemplate();
  },

  _processAttributes: function() {
    var _this = this;
    _.each(this.attributes, function(val, attr) {
      if (attr == 'class') {
        _this.$el.addClass(val);
      }
      else {
        _this.$el.attr(attr, val);
      }
    });
  },

	_processTemplate: function() {
		var $template = $("[template-name='"+this.name+"']");
		if ($template.length) {
			this.template = Handlebars.compile($template.html());
		}
		this.render();
	},

  _processInitFunctions: function() {
    var _this = this;

    if (!_.isUndefined(this.init_functions) && !_.isNull(this.init_functions) &&
        !_.isEmpty(this.init_functions)){

      _.each(this.init_functions, function(func) {

        if (!_this[func] && !_.isFunction(_this[func])){
          throw 'View '+this.name+' does not contain function: '+func;
          return;
        }
        _.bindAll(_this,func);
        _this[func].call(this);
      });
    }
  },

  _processChildren: function() {
    var _this = this;
    if (!this.children || this.children.length == 0) {
      return;
    }

    _.each(this.children, function(obj, name) {
      if (!obj.view) {
        throw this.name+' MissingViewError: Child '+name+' needs a view.';
      }
			_this.addChild(obj.view, obj.selector, obj.data);
    });
  },

  appendTo: function(selector) {
    this.$el.appendTo(selector);
    return this;
  },

	addChild: function(view_name, selector, data) {
		var view;
		if (!_.has(App.Views, view_name)) {
			throw "MissingViewError: "+view_name+" is not a view";
		}

		var $selector = this.$el.find(""+selector);
		if (!!$selector.length) {
			view = new App.Views[view_name]({
				el: $selector,
				data: data,
				parent: this
			});
			this._children[view.cid] = view;
		}
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

	render: function() {
		this.removeAllChildren();

		if (!!this.template) {
			this.$el.html(this.template(this));
		}
    this._processChildren();
		return this;
	}
})
