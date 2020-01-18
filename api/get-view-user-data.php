<?php

/**
 * Description
 * 
 * Given as parameters the jwt and an email from a json post call it checks if the jwt comes from a valid user
 * and if it does it looks for the user with the given email and returns their data.
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
include_once("objects/jobPost.php");
 
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
$email = isset($data->email) ? $data->email : "";

if($jwt && $email){
    try {
        // decode jwt
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        getData($decoded->data->email, $email);
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

function getData($jwt_email, $view_email) {
    // get database connection
    $database = new Database();
    $conn = $database->getConnection();

    // initialize user
    $user = new User($conn);

    // set user paramter
    $user->email = $jwt_email;

    if($user->getParameters()) {
        // user authenticated, return the other email's data
        $viewUser = new User($conn);
        $viewUser->email = $view_email;
        if($viewUser->getParameters()) {
            // initialize experience object
            $experience = new Experience($conn);

            // extract parameters from the data
            $experience->id_user = $viewUser->id_user;

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
            $skill->id_user = $viewUser->id_user;

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
            $education->id_user = $viewUser->id_user;

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
            $language->id_user = $viewUser->id_user;

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

            // initialize job post object
            $jobPost = new JobPost($conn);

            // extract parameters from the data
            $jobPost->id_user = $viewUser->id_user;

            // get all job_post parameters
            $jobPost->getAll();

            // make jobPost output
            $jobPostData = array();
            for($i = 0; $i < count($jobPost->id_profession); $i++) {
                array_push($jobPostData, array(
                    "id_profession" => $jobPost->id_profession[$i],
                    "title" => $jobPost->title[$i],
                    "description" => $jobPost->description[$i]
                ));
            }

            // make users'info output
            $userData = array(
                "firstname" => $viewUser->firstname,
                "lastname" => $viewUser->lastname,
                "email" => $viewUser->email,
                "availability" => $viewUser->availability,
                "title" => $viewUser->title,
                "bio" => $viewUser->bio,
                "image_path" => $viewUser->image_path,
                "video_path" => $viewUser->video_path,
                "resume_path" => $viewUser->resume_path,
                "role" => $viewUser->role
            );

            // set response code
            http_response_code(200);
        
            // send json
            echo json_encode(array(
                "user" => $userData,
                "experience" => $experienceData,
                "skill" => $skillData,
                "education" => $educationData,
                "language" => $languageData,
                "job_post" => $jobPostData
            ));
        }
    }
}

?>