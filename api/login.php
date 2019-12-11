<?php

/**
 * Get email and password from a json post call and login user
 */

// required headers
// LATER ON RELEASE CHANGE AGAIN THIS HEADER
#header("Access-Control-Allow-Origin: http://localhost/junior-workers/api/");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
if($user->emailExists() && password_verify($data->password, $user->password)) {
    // generate and send back a jwt
    $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => array(
            "id" => $user->id,
            "firstname" => $user->firstname,
            "lastname" => $user->lastname,
            "email" => $user->email
        )
     );
  
     // set response code
     http_response_code(200);
  
     // generate jwt
     $jwt = JWT::encode($token, $key);
     echo json_encode(
             array(
                 "message" => "Successful login.",
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