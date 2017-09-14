App.View.extend({
  name: "views/example/view_b",

  init_functions: [
    'setup',
  ],

  children: {
    name_input: {view: 'components/input/main', selector: '#name'},
    save_button: {view: 'components/button/main', selector: '#done'},
  },

  setup: function() {
    _.bindAll(this,'_save');

    // this.data.info was setup in pages/example.js
    this.local = {
      person: this.data.info.clone(),
    };

    this.children.name_input.data = {
      model: this.local.person,
      attribute: 'name',
    };

    this.children.save_button.data = {
      event_handler: this._save,
    };

  },

  _save: function() {
    this.data.info.set(this.local.person.attributes);
  },
});
