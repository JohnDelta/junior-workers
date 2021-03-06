<?php

/**
 * Description
 * 
 * Read from a form post call an reume file and a text file containing the jwt.
 * Test jwt if it comes from a valid user and change their reume to the given one.
 * 
 * NOTE: change PHP.ini file at "upload_max_filesize" to accept files 10MB or less.
 * 		 change PHP.ini file at "post_max_size" to accept post files 10MB or less.
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

include_once("config/database.php");
include_once("objects/user.php");
 
// required to decode jwt
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

// set-up returned codes
$SUCCESS_CODE = "0";
$ERROR_CODE = "1";
$ERROR_FORMAT_CODE = "2";
$ERROR_SIZE_CODE = "3";

// read jwt and check if its from valid user
if(($_POST["jwt"])) {
	$jwt = $_POST["jwt"];
	try {
        // decode jwt
        $decoded = JWT::decode($jwt, $key, array('HS256'));
		$email = $decoded->data->email;
		
		// get database connection
		$database = new Database();
		$conn = $database->getConnection();
	
		// initialize user
		$user = new User($conn);
		$user->email = $email;

		// check if user exist
		if($user->getParameters()) {
			// read video file
			if(!empty($_FILES["resume_file"]["name"])) {

				// if the file has the correct size
				if($_FILES["resume_file"]["size"] <= 10000000) {

					$test = explode(".", $_FILES["resume_file"]["name"]);
					$extension = end($test);
					$name = rand(100, 999999999) . "." . $extension;
					$location = "./uploads/" .$name;
					move_uploaded_file($_FILES["resume_file"]["tmp_name"], $location);

					// here delete the previous resume if they have any
					if(!empty($user->resume_path)) {
						if(file_exists("./uploads/".$user->resume_path)) {
							unlink("./uploads/".$user->resume_path);
						}
					}

					// give user the new path to resume
					$user->resume_path = $name;

					if($user->alterAll()) {
						// set response code
						http_response_code(200);
					
						echo json_encode(array(
							"message" => "Data altered",
							"code"=>$SUCCESS_CODE
						));		
					} else {
						// set response code
						http_response_code(401);
					
						// tell the user access denied  & show error message
						echo json_encode(array(
							"message" => "Unable to alter user's data",
							"code"=>$ERROR_CODE
						));	
					}

				} else {
					// set response code
					http_response_code(401);
				
					// tell the user access denied  & show error message
					echo json_encode(array(
						"message" => "File cannot have size larger than 10MB",
						"code"=>$ERROR_SIZE_CODE
					));	
				}
			} else {
				// set response code
				http_response_code(401);
			
				// tell the user access denied  & show error message
				echo json_encode(array(
					"message" => "File doesn't exist.",
					"code"=>$ERROR_CODE
				));	
			}
		} else {
			// set response code
			http_response_code(401);
		
			// tell the user access denied  & show error message
			echo json_encode(array(
				"message" => "Access denied. Cannot get user parameters",
				"code"=>$ERROR_CODE
			));	
		}
    }
    catch (Exception $e){
        // set response code
        http_response_code(401);
    
        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied.",
            "error" => $e->getMessage(),
			"code"=>$ERROR_CODE
        ));
    }
} else {
	// set response code
	http_response_code(401);
			
	// tell the user access denied  & show error message
	echo json_encode(array(
		"message" => "JWT doesnt exist.",
		"code"=>$ERROR_CODE
	));	
}

?>