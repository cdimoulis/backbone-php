# backbone-php
Use backbone.js and handlebar templates with PHP.

#### Requirements
You must keep the folders:
* /app
* /templates
* /utilities

in your application. You may remove any files associated with the example.

#### For testing and examples
For the purposes of testing and learning this repo is a complete working PHP app. Assuming PHP is installed simply run `start.sh` in the root directory. This uses the built in PHP server. This server uses the `/dev.ini` file. Feel free to edit if you wish to use your in ini file. Also this file causes all requests to be initially routed to `/init.php`.

Beginning with the file `/example.php` you can see how to setup a page for use of the app. This includes the use of backbone views, models, controllers.

## Page Setup
Refer to `/example.php`.

You must include `/templates/app/header.php` in the `<head>` tag of any php page you wish to utilize the functionality. This will place all dependecies, js, and template files in your page head.

Any data you wish to be passed to the initial js page view please add to the `App.page_data` js object. Our example php page simply has one key, `my_info` which is an extended backbone model (see `/app/js/lib/models/example.model.js` for more).

Lastly treat the `<body>` as a template to attach additional views to. In the case of our example there are 2 `<div>` elements that will eventually contain child views of the page.

## Page View
Refer to `/app/js/pages/example.js`

In the `/app/js/pages` folder add a file to represent the page. The name attribute of the page should match the route of the php page. The page will be attached to the body element automatically if the page name
matches the php file route and name (no initial '/' and no .php).  
For example using the format {php file} -> {page view name}:
* /example.php -> example
* /users/create.php -> users/create

If navigating to a folder with an assumed index.php file the page name must
contain index in the name:
* /users/edit -> users/edit/index

## Using a View
See views under `/app/js/views/example`

Pages are views, however they are specifically designed to be the view starting point of a page and thus have the main difference of their naming convetion.

For views other than pages the `name` attribute is how a child view will be referenced and how the handlebars template will chosen.

Thus the name for a view should be in a route format like `views/example/view_a` as to match the file location of the associated template.

Any data passed from the parent view can be accessed using `this.data`. This includes `App.page_data` that is setup in the php file and passed to the page view.

The `init_function` array of a view specify which functions (and in which order) should be run on view initialization.

Child views can be specified in the `children` object. Each child has an object that contains:
* view: The name (string) of the view used to render the child
* selector: The selector (string) of the element to attach the view to
* data: An object of data desired to be passed to child view this can be set in one of the init_functions

## Components
See `/app/js/components`.

Components are intended for reusable elements of a page. While any view can be reused the Components folder is to indicate lower level elements like input, buttons, etc.

Components are simply views. The only requirement is to pass the appropriate keys in the data object to those components.

## Templates
See `/app/templates/`. Handlebar templates are used.

As mentioned the handlebar template file location under `/app/templates` should match the name of the corresponding view it is associated with.

## File Locations
For files under `/app/js/views`, `/app/templates/views`, and `/app/stylesheets/views` there should be a folder for the particular page that holds the views, templates, and stylesheets for that page.

What this means is if the page is `example.php` then all views used for that page should be within the directory `/app/js/views/example` (including any subdirectory). This is similar with templates and stylesheets. This prevents views from being loaded that are NOT necessary for a particular page.

Anything placed in the `/app/js/components`, `/app/templates/components`, and `/app/stylesheets/components` will be included on any page. Thus this is where you should put reusable views.
