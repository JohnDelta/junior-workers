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

// include scripts
include_once("config/database.php");
include_once("objects/experience.php");
include_once("objects/user.php");
include_once("objects/skill.php");
include_once("objects/education.php");
include_once("objects/language.php");
 
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
        // send the email from jwt to authenticate user and return all their data
        getData($decoded->data->email);
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

// if the jwt is correct extract user's email and get all their data
function getData($jwt_email) {
    // get database connection
    $database = new Database();
    $conn = $database->getConnection();

    // initialize user
    $user = new User($conn);

    // set user paramter
    $user->email = $jwt_email;

    // check if the user is valid and get all their other attributes
    if($user->getParameters()) {
        // initialize experience object
        $experience = new Experience($conn);

        // extract parameters from the data
        $experience->id_user = $user->id_user;

        // get all experience parameters
        $experience->getAll();

        // make experience output
        $experienceData = array();
        for($i = 0; $i < count($experience->id_profession); $i++) {
            array_push($experienceData, array(
                "id_profession" => $experience->id_profession[$i],
                "company" => $experience->company[$i],
                "date" => $experience->date[$i]
            ));
        }

        // initialize skill object
        $skill = new Skill($conn);

        // extract parameters from the data
        $skill->id_user = $user->id_user;

        // get all skill parameters
        $skill->getAll();

        // make skill output
        $skillData = array();
        for($i = 0; $i < count($skill->id_skill); $i++) {
            array_push($skillData, array(
                "id_skill" => $skill->id_skill[$i]
            ));
        }

        // initialize education object
        $education = new Education($conn);

        // extract parameters from the data
        $education->id_user = $user->id_user;

        // get all education parameters
        $education->getAll();

        // make education output
        $educationData = array();
        for($i = 0; $i < count($education->id_education); $i++) {
            array_push($educationData, array(
                "id_education" => $education->id_education[$i],
                "id_education_level" => $education->id_education_level[$i]
            ));
        }

        // initialize language object
        $language = new Language($conn);

        // extract parameters from the data
        $language->id_user = $user->id_user;

        // get all language parameters
        $language->getAll();

        // make education output
        $languageData = array();
        for($i = 0; $i < count($language->id_language); $i++) {
            array_push($languageData, array(
                "id_language" => $language->id_language[$i],
                "id_language_level" => $language->id_language_level[$i]
            ));
        }

        // make users'info output
        $userData = array(
            "firstname" => $user->firstname,
            "lastname" => $user->lastname,
            "email" => $user->email,
            "availability" => $user->availability,
            "title" => $user->title,
            "bio" => $user->bio,
            "image_path" => $user->image_path,
            "video_path" => $user->video_path
        );

        // set response code
        http_response_code(200);
    
        // send json
        echo json_encode(array(
            "user" => $userData,
            "experience" => $experienceData,
            "skill" => $skillData,
            "education" => $educationData,
            "language" => $languageData
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