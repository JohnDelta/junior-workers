<?php

/**
* Description
 * 
 * given the jwt as parameter from a json post call it extracts the email from it and
 *  removes user's video if they have.
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

// include scripts
include_once("config/database.php");
include_once("objects/user.php");
 
// required to decode jwt
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// get jwt
$jwt = isset($data->jwt) ? $data->jwt : "";

if($jwt){
    try {
        // decode jwt
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        // send the email from jwt to authenticate user and remove their video
        removeVideo($decoded->data->email);
    }
    catch (Exception $e){
        // set response code
        http_response_code(401);
    
        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied.",
            "error" => $e->getMessage()
        ));
    }
}
else {
    // set response code
    http_response_code(401);
 
    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}

// if the jwt is correct extract user's email and remove their video
function removeVideo($jwt_email) {
    // get database connection
    $database = new Database();
    $conn = $database->getConnection();

    // initialize user
    $user = new User($conn);

    // set user paramter
    $user->email = $jwt_email;

    // check if the user is valid and get all their other attributes
    if($user->getParameters()) {
        
        // alter user's data with the initial
        if(!empty($user->video_path) || $user->video_path != "") {
            //remove previous image
            if(file_exists("./uploads/".$user->video_path)) {
                unlink("./uploads/".$user->video_path);
            }

            //add initial video
            $user->video_path = "";
            $user->alterAll();
        }

        // set response code
        http_response_code(200);
    
        // send json
        echo json_encode(array(
            "message" => "video removed"
        ));
    } else {
        // set response code
        http_response_code(400);
    
        // send json
        echo json_encode(array(
            "message" => "Access denied."
        ));
    }
}

?>