<?php

/**
 * add experience given from a json 
 */

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
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
}
 
// include database and experience scripts
include_once("config/database.php");
include_once("objects/experience.php");
include_once("objects/user.php");

// get database connection
$database = new Database();
$conn = $database->getConnection();

// get data from the given post call
$data = json_decode(file_get_contents("php://input"));

// initialize user
$user = new User($conn);

// extract user paramter
$user->id_user = $data->id_user;

// check if the user is valid
if($user->exist()) {
    // initialize experience object
    $experience = new Experience($conn);

    // extract parameters from the data
    $experience->id_user = $data->id_user;
    foreach($data->experience as $line) {
        array_push($experience->title, $line->title);
        array_push($experience->company, $line->company);
        array_push($experience->date, $line->date);
    }

    // add inserted experience to user
    $experience->insertAll();

    // set response code
    http_response_code(200);
    
    // tell the user login failed
    echo json_encode(array("message" => "DONE"));
} else {
    // set response code
    http_response_code(401);
        
    // tell the user login failed
    echo json_encode(array("message" => "FAILED"));
}

?>