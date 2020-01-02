<?php

// required headers
// LATER ON RELEASE CHANGE AGAIN THIS HEADER
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//https://stackoverflow.com/questions/8719276/cors-with-php-headers
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: POST, OPTIONS");         
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
}

$msg = "something happended";


if($_FILES["file"]["name"] != "") {
	$test = explode(".", $_FILES["file"]["name"]);
	$extension = end($test);
	$name = rand(100, 999) . "." . $extension;
	$location = "./uploads/" .$name;
	move_uploaded_file($_FILES["file"]["tmp_name"], $location);
	$msg = "img uploaded";
}

http_response_code(200);
echo json_encode(array("msg"=>$msg));

?>