<?php

/**
 * Description
 * 
 * Given the jwt and all user data as parameters of a post json call, if the jwt is valid
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
        $user->bio = $data->user->bio;
        if($user->alterAll()) {

            // according to the user's role alter the proper data
            if($user->role == "candidate") {
                // get all experience and insert it
                // if the values are "" it means they've been removed
                $experience = new Experience($conn);
                if($data->experience != "" || !empty($data->experience) || $data->experience != array()) {
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

                // get all skill and insert it
                // if the values are "" it means they've been removed
                $skill = new Skill($conn);
                if($data->skill != "" || !empty($data->skill) || $data->skill != array()) {
                    $skill->id_user = $user->id_user;
                    foreach($data->skill as $line) {
                        if($line != "") {
                            array_push($skill->id_skill, $line->id_skill);
                        }
                    }
                    $skill->insertAll();
                } else {
                    $skill->removeAll();
                }

                // get all education and insert it
                // if the values are "" it means they've been removed
                $education = new Education($conn);
                if($data->education != "" || !empty($data->education) || $data->education != array()) {
                    $education->id_user = $user->id_user;
                    foreach($data->education as $line) {
                        if($line != "") {
                            array_push($education->id_education, $line->id_education);
                            array_push($education->id_education_level, $line->id_education_level);
                        }
                    }
                    $education->insertAll();
                } else {
                    $education->removeAll();
                }

                // get all language and insert it
                // if the values are "" it means they've been removed
                $language = new Language($conn);
                if($data->language != "" || !empty($data->language) || $data->language != array()) {
                    $language->id_user = $user->id_user;
                    foreach($data->language as $line) {
                        if($line != "") {
                            array_push($language->id_language, $line->id_language);
                            array_push($language->id_language_level, $line->id_language_level);
                        }
                    }
                    $language->insertAll();
                } else {
                    $language->removeAll();
                }
            } else if($user->role == "hirer") {
                // get all jobposts and insert it
                // if the values are "" it means they've been removed
                $job_post = new JobPost($conn);
                if($data->job_post != "" || !empty($data->job_post) || $data->job_post != array()) {
                    $job_post->id_user = $user->id_user;
                    foreach($data->job_post as $line) {
                        if($line != "") {
                            array_push($job_post->id_profession, $line->id_profession);
                            array_push($job_post->title, $line->title);
                            array_push($job_post->description, $line->description);
                        }
                    }
                    $job_post->insertAll();
                } else {
                    $job_post->removeAll();
                }
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