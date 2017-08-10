<?php
class DataUtil {

	public static function buildJSArray($array) {
		$js = "[";
		foreach($array as $val) {
			// If the data is not empty then print
			if (!is_null($val)) {
				// If val is numeric don't add quotes
				if (is_numeric($val)) {
					$js = $js . $val . ",";
				}
				else {
					$js = $js . '"' . $val . '",';
				}
			}
			$js = $js . $val . ",";
		}
		rtrim($js, ',');
		$js = $js . "]";
		return $js;
	}

	public static function buildJSObject($obj, $show_null) {
		$js = "{";
		// Loop through to build string for echo
		foreach($obj as $key => $val) {
			// If the data is not empty then print
			if (!is_null($val)) {
				// If val is numeric don't add quotes
				if (is_numeric($val)) {
					$js = $js . $key . ":" . $val . ",";
				}
				else {
					$js = $js . $key . ': "' . $val . '",';
				}
			}
			else {
				// If data is empty but null is desired print
				if ($show_null) {
					$js = $js . $key . ": null,";
				}
			}
		}
		rtrim($js, ",");
		$js = $js . "}";
		return $js;
	}

	public static function buildJSONFromQuery($query, $show_null=false) {
		$js = '[';
		foreach($query->Results as $model) {
			$js = $js . DataUtil::buildJSObject($model, $show_null);
			$js = $js.",";
		}
		rtrim($js, ",");
		$js = $js."]";

		return $js;
	}

	public static function buildJSONModelFromQuery($query, $show_null=false) {
		if (count($query->Results) > 0) {
			$model = $query->Results[0];
			$js = DataUtil::buildJSObject($model, $show_null);

			return $js;
		}
		else {
			return "{}";
		}
	}
}


?>
