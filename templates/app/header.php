<?php
/********
Include this file in the <head> of pages where the backbone models, collections,
and views will be used.
*********/

// Get page info
$route = trim($_SERVER['REQUEST_URI'], '//');
// If route does not contain .php then add /index
// Otherwise strip out the php
if (strpos($route, ".php") == false) {
  $page_name = $route."/index";
}
else {
  $page_name = explode('.php',$route)[0];
}

// Build routes for header imports
$features = dirname(__FILE__).'/../../app/js/lib/features';
$models = dirname(__FILE__).'/../../app/js/lib/models';
$collections = dirname(__FILE__).'/../../app/js/lib/collections';
$components = dirname(__FILE__).'/../../app/js/components';
$views = dirname(__FILE__).'/../../app/js/views/'.$page_name;
$page_template = dirname(__FILE__).'/../../app/templates/pages/'.$page_name;
$component_templates = dirname(__FILE__).'/../../app/templates/components';
$view_templates = dirname(__FILE__).'/../../app/templates/views/'.$page_name;
$component_stylesheets = dirname(__FILE__).'/../../app/stylesheets/components';
$feature_stylesheets = dirname(__FILE__).'/../../app/stylesheets/features';
$page_stylesheets = dirname(__FILE__).'/../../app/stylesheets/pages/'.$page_name;
$view_stylesheets = dirname(__FILE__).'/../../app/stylesheets/views/'.$page_name;
$feature_files = [];
$model_files = [];
$collection_files = [];
$component_files = [];
$view_files = [];
$component_template_files = [];
$view_template_files = [];
$component_stylesheet_files = [];
$feature_stylesheet_files = [];
$page_stylesheet_files = [];
$view_stylesheet_files = [];

// Get all the files in a particular directory to inclusion
// Recusively calls itself to fine all files in all subdirectories
function getFiles(&$files, $base, $file, $ext) {
  if (is_dir($base.$file)){
    foreach(scandir($base.$file) as $file_name) {
      if ($file_name != '.' && $file_name != '..') {
        getFiles($files, $base, $file."/".$file_name, $ext);
      }
    }
  }
  else {
    $len = strlen($file);
    $pos = strpos($file, $ext);
    $ext_len = strlen($ext);
    # Only add file to list if it has the specified extention
    if (!empty($pos) && ($len-$pos == $ext_len)) {
      $file_name = explode($ext, $file)[0];
      array_push($files, $file_name);
    }
  }
}

getFiles($feature_files, $features, "", ".js");
getFiles($model_files, $models, "", ".js");
getFiles($collection_files, $collections, "", ".js");
getFiles($component_files, $components, "", ".js");
getFiles($view_files, $views, "", ".js");
getFiles($component_template_files, $component_templates, "", ".handlebars");
getFiles($view_template_files, $view_templates, "", ".handlebars");
getFiles($component_stylesheet_files, $component_stylesheets, "", ".css");
getFiles($feature_stylesheet_files, $feature_stylesheets, "", ".css");
getFiles($page_stylesheet_files, $page_stylesheets, "", ".css");
getFiles($view_stylesheet_files, $view_stylesheets, "", ".css");

// Output the static header files for a page
$scripts = "
  <script src='https://code.jquery.com/jquery-3.2.1.min.js' integrity='sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=' crossorigin='anonymous'></script>
  <script src='http://underscorejs.org/underscore-min.js'></script>
  <script src='http://backbonejs.org/backbone-min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js'></script>
  <script src='/app/js/lib/string.js'></script>
  <script src='/app/js/lib/model.js'></script>
  <script src='/app/js/lib/collection.js'></script>
  <script src='/app/js/lib/view.js'></script>\n";

// Add features
foreach($feature_files as $file) {
  $scripts = $scripts."  <script src='/app/js/lib/features".$file.".js'></script>\n";
}

// APP and CSS static files
$scripts = $scripts."
  <script src='/app/js/application.js'></script>
  <script src='/app/js/init.js'></script>
  <link href='/app/stylesheets/app.css' rel='stylesheet' type='text/css' />\n";

// Add component stylesheets
foreach($component_stylesheet_files as $file) {
  $scripts = $scripts."  <link href='/app/stylesheets/components/".$file.".css' rel='stylesheet' type='text/css' />\n";
}

// Add feature stylesheets
foreach($feature_stylesheet_files as $file) {
  $scripts = $scripts."  <link href='/app/stylesheets/features/".$file.".css' rel='stylesheet' type='text/css' />\n";
}

// Add page stylesheets
foreach($page_stylesheet_files as $file) {
  $scripts = $scripts."  <link href='/app/stylesheets/pages/".$page_name."/".$file.".css' rel='stylesheet' type='text/css' />\n";
}

// Add view stylesheets
foreach($view_stylesheet_files as $file) {
  $scripts = $scripts."  <link href='/app/stylesheets/views/".$page_name."/".$file.".css' rel='stylesheet' type='text/css' />\n";
}

// Add add models
foreach($model_files as $file) {
  $scripts = $scripts."  <script src='/app/js/lib/models".$file.".js'></script>\n";
}

// Add add collections
foreach($collection_files as $file) {
  $scripts = $scripts."  <script src='/app/js/lib/collections".$file.".js'></script>\n";
}

// Add the page template
if (is_file($page_template.'.handlebars')){
  $page_contents = file_get_contents($page_template.'.handlebars');
  $scripts = $scripts."  <script template-name='pages/".$page_name."' type='text/x-handlebars-template'>".$page_contents."</script>\n";
}

// Add component templates
foreach($component_template_files as $file) {
  $contents = file_get_contents($component_templates.$file.'.handlebars');
  $scripts = $scripts."  <script template-name='components/".trim($file,'/')."' type='text/x-handlebars-template'>".$contents."</script>\n";
}

// Add view templates
foreach($view_template_files as $file) {
  $contents = file_get_contents($view_templates.$file.'.handlebars');
  $scripts = $scripts."  <script template-name='views/".$page_name."/".trim($file,'/')."' type='text/x-handlebars-template'>".$contents."</script>\n";
}

// Add js components
foreach($component_files as $file) {
  $scripts = $scripts."  <script src='/app/js/components".$file.".js'></script>\n";
}

// Add js views
foreach($view_files as $file) {
  $scripts = $scripts."  <script src='/app/js/views/".$page_name.$file.".js'></script>\n";
}

// Add the js page
$scripts = $scripts."  <script src='/app/js/pages/".$page_name.".js'></script>\n";

echo $scripts;
?>
