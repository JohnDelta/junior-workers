<?php

/**
 * given the jwt and user data as parameters, if the jwt is valid
 *  alter all user's data with the new ones
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
		header("Access-Control-Allow-Methods: POST, OPTIONS");         
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
$postData = json_decode(file_get_contents("php://input"));
 
// get jwt & data
$jwt = isset($postData->jwt) ? $postData->jwt : "";
$data = isset($postData->data) ? $postData->data : "";

if($jwt){
    try {
        // decode jwt
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        // send the email from jwt to authenticate user and the data to alter
        postData($decoded->data->email, $data);
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

function postData($jwt_email, $data) {
    // get database connection
    $database = new Database();
    $conn = $database->getConnection();

    // initialize user
    $user = new User($conn);

    // set user paramter
    $user->email = $jwt_email;

    // check if the user is valid
    if($user->getParameters()) {

        // alter user's data
        $user->firstname = $data->user->firstname;
        $user->lastname = $data->user->lastname;
        $user->title = $data->user->title;
        $user->availability = $data->user->availability;
        if($user->alterAll()) {

            // get all experience and insert it
            // if the values are "" it means their're removed
            $experience = new Experience($conn);
            if($experience != "") {
                $experience->id_user = $user->id_user;
                foreach($data->experience as $line) {
                    if($line != "") {
                        array_push($experience->id_profession, $line->id_profession);
                        array_push($experience->company, $line->company);
                        array_push($experience->date, $line->date);
                    }
                }
                $experience->insertAll();
            } else {
                $experience->removeAll();
            }

            // set response code
            http_response_code(200);
        
            // send json
            echo json_encode(array(
                "message" => "User's data altered"
            ));
        } else {
            // set response code
            http_response_code(400);
                            
            // send json
            echo json_encode(array(
                "message" => "Unable to alter user's data"
            ));
        }
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