<?php

/**
 * Get email and password from a json post call and login user
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

// generate json web token
include_once('config/core.php');
include_once('libs/php-jwt-master/src/BeforeValidException.php');
include_once('libs/php-jwt-master/src/ExpiredException.php');
include_once('libs/php-jwt-master/src/SignatureInvalidException.php');
include_once('libs/php-jwt-master/src/JWT.php');
use \Firebase\JWT\JWT;
 
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
$user->email = $data->email;

// check if user exists and if his password matches the hashed in db
if($user->getParameters() && password_verify($data->password, $user->password)) {
    // generate and send back a jwt
    $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => array(
            "email" => $user->email
        )
     );
  
     // set response code
     http_response_code(200);
  
     // generate jwt
     $jwt = JWT::encode($token, $key);
     echo json_encode(
             array(
                 "jwt" => $jwt
             )
         );
} else {
    // set response code
    http_response_code(401);
    
    // tell the user login failed
    echo json_encode(array("message" => "Login failed."));
}
?>