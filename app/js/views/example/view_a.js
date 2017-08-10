App.View.extend({
	name: "views/example/view_a",

	init_functions: [
		'setup',
    'listenToChange',
	],

  children: {
	},

	setup: function() {

    // this.data.info was setup in pages/example.js
    this.display = {
      name: this.data.info.get('name'),
      age: this.data.info.get('age'),
    };
	},

  listenToChange: function() {
    this.listenTo(this.data.info, 'change', function() {
      this.setup();
      this.render()
    });
  },
});
