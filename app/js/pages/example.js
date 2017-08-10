/**********
There will only be one page view per, well, page!
The page will be attached to the body element automatically if the page name
matches the php file name
***********/

App.Page.extend({
	name: "pages/example",

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

	},

	setup: function() {

	},
});
