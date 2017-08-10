/************

Expected data:
  model: The model that will contain the selected info_person
  view: The view that will be used to display the list views
	view_data: The data object for the list view
	search_results: The collection of search resutls (optional)

/***********/

App.View.extend({
  name: 'components/type_select/main',
  init_functions: [
    'setup',
		'setupListeners',
  ],
	attributes: {
		'class': 'type_select'
	},
	children: {
		search_val: {view: 'components/input/main', selector: 'input#filter'},
		list: {view: 'components/list/main', selector: 'div.list'},
	},

  setup: function() {
    _.bindAll(this, 'modelChange', 'onChange', '_doFetch');

		var model_name = this.data.model.name
		this.local = {
			model: this.data.model,
			filter_model: !!model_name && _.has(App.Models, model_name) ? new App.Models[model_name]() : new App.Model(),
			search_results: this.data.search_results || ( !!model_name && _.has(App.Collections, model_name) ? new App.Collections[model_name]() : new App.Collection() ),
		};

		//Set the filter model
		this.local.filter_model.set(this.data.model.attributes);

		// Setup Children
		this.children.search_val.data = {
			model: this.local.filter_model,
			attribute: this.data.attribute,
		};

		this.children.list.data = {
			collection: this.local.search_results,
			view: this.data.view,
			view_data: this.data.view_data,
		};

  },

	setupListeners: function() {
		var doFetch = _.debounce(this._doFetch, 250);
		this.listenTo(this.local.filter_model, 'change:'+this.data.attribute, doFetch);
		this.listenTo(this.local.model, 'sync change', this.modelChange);

		this.listenTo(this.local.search_results, 'sync', function() {

		});
	},

  modelChange: function() {
		this.local.filter_model.set(this.local.model.attributes);
  },

  onChange: function() {

  },

	_doFetch: function(model, val) {
		if (val.length > 0) {
			var data = {
				search_val: val,
			};
			this.local.search_results._customFetch("search.php", {data: data});
		}
		else {
			this.local.search_results.reset();
		}
	},
});
