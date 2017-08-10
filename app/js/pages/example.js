/**********
There will only be one page view per, well, page!
The page will be attached to the body element automatically if the page name
matches the php file route and name (no initial '/' and no .php)
/example.php -> example
/users/create.php -> users/create

If navigating to a folder with an assumed index.php file the page name must
contain index in the name
/users/edit -> users/edit/index

***********/

App.Page.extend({
  // See above comments for naming convention
	name: "example",

  // Functions to run when page is created
	init_functions: [
		'setup',
	],

  // Child views object
  // Each child has an object that contains:
  //    view: The name (string) of the view used to render the child
  //    selector: The selector (string) of the element to attch the view to
  //    data: An object of data desired to be passed to child view this can be
  //          set in one of the init_functions
  children: {
    first: {view: 'views/example/view_a', selector: '#view_a'},
    second: {view: 'views/example/view_b', selector: '#view_b'},
	},

	setup: function() {

    // Pass desired data object down to children
    this.children.first.data = {
      info: this.data.my_info, // my info was setup in the App.page_data in example.php
    };

    this.children.second.data = {
      info: this.data.my_info,
    };

	},
});
