<!DOCTYPE>
<?php
// Incldue any php utility files needed
require_once('utilities/data_util.php');


# Setup any data with php
$data_array_from_db = [
  "name" => "Chris",
  "age" => 34,
  "nationality" => "Greek"
];


?>
<html>
<head>

  <?php
  include(dirname(__FILE__).'/templates/app/header.php');
  ?>

  <!--
    Setup the data that will be passed to the backbone page
  -->
  <script type="text/javascript">
    App.page_data = {
		  my_info: new App.Models.Example(<?php echo(DataUtil::buildJSObject($data_array_from_db, true)); ?>),
    };

  </script>

</head>
<body>
  <h1>
    Example
  </h1>
  <div id='view_a'></div>

  <div id='view_b'></div>
</body>
</html>
