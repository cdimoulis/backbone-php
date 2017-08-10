/************

Expected data:
	collection: collection to display as a list
	view: The name of the view used to display each model in the list
	view_data: The data object for the view. Optional. Default = {}

/***********/

App.View.extend({
	name: 'components/list/main',
	init_functions: [
		'setup',
		'showList',
	],

	setup: function() {
		_.bindAll(this, 'showList', 'addItem');
		this.local = {
			list_items: {},
		};

		this.listenTo(this.data.collection, 'reset', this.showList);
		this.listenTo(this.data.collection, 'add', this.addItem);
		this.listenTo(this.data.collection, 'remove', this.removeItem);
	},

	showList: function() {
		var _this = this;
		this.$el.empty();
		this.data.collection.each( function(model) {
			_this.addItem(model);
		});
	},

	addItem: function(model) {
		var data = _.clone(this.data.view_data) || {};
		data.model = model;

		var list_item = new App.Views[this.data.view]({
			data: data,
			parent: this,
		});
		this.local.list_items[model.cid] = list_item;

		list_item.appendTo(this.$el);
	},

	removeItem: function(model) {
		var list_item = this.local.list_items[model.cid];

		if (!!list_item) {
			list_item.remove();
		}
	},
});
