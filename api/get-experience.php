<?php

/**
 * given the jwt as parameter it extracts the id_user from it and
 *  sends back all experience the user has.
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
        getExperience($decoded->data->email);
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

// if the jwt is correct run this
// get total user's data and send it as json
function getExperience($email) {
    // get database connection
    $database = new Database();
    $conn = $database->getConnection();

    // initialize user
    $user = new User($conn);

    // set user paramter
    $user->email = $email;

    // check if the user is valid
    if($user->getParameters()) {
        /*
        // initialize experience object
        $experience = new Experience($conn);

        // extract parameters from the data
        $experience->id_user = $user->id_user;

        // get all experience parameters
        $experience->getAll();

        // make experience output
        $experienceData = array();
        for($i = 0; $i < count($experience->title); $i++) {
            array_push($experienceData, array(
                "title" => $experience->title[$i],
                "company" => $experience->company[$i],
                "date" => $experience->date[$i]
            ));
        }*/

        // make users'info output
        $userData = array(
            "firstname" => $user->firstname,
            "lastname" => $user->lastname,
            "email" => $user->email
        );

        // set response code
        http_response_code(200);
    
        // send json
        echo json_encode(array(
            "message" => "Access granded.",
            "user" => $userData
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