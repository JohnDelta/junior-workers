<?php

/**
 * create-user takes json data from a post ajax call
 * which contain all arguments of a user and creates it.
 * After that sends back feedback.
*/

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


//https://stackoverflow.com/questions/8719276/cors-with-php-headers
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
}

 
// include database and user initialization scripts
include_once("config/database.php");
include_once("objects/user.php");

// get database connection
$database = new Database();
$conn = $database->getConnection();

// initialize user object
$user = new User($conn);

// get data from the given post call
$data = json_decode(file_get_contents("php://input"));
 
// extract parameters from the data
$user->firstname = $data->firstname;
$user->lastname = $data->lastname;
$user->email = $data->email;
$user->password = $data->password;

// check if user exists
if($user->emailExists()) {
    //set response code & return message
    http_response_code(400);
    echo json_encode(array("Message" => "Email exists"));
} else {
    // create user
    if(!empty($user->firstname) &&
    !empty($user->lastname) &&
    !empty($user->email) &&
    !empty($user->password) &&
    $user->create()) {
        // set response code & return message
        http_response_code(200);
        echo json_encode(array("Message" => "User created"));
    } 
    else {
    //set response code & return message
    http_response_code(400);
    echo json_encode(array("Message" => "Unable to create user"));
    }
}

?>