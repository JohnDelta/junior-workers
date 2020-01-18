<?php

/**
 * Description
 * 
 * Takes as json call argument the email from an existing user to download their resume if they have.
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
$FILE_CANNOT_FOUND_CODE = "2";


if($_POST["email"]) {
    $resumesEmail = $_POST["email"];

	try {
		// get database connection
		$database = new Database();
		$conn = $database->getConnection();
            
        // initialize email's resume user
        $resumeUser = new User($conn);
        $resumeUser->email = $resumesEmail;

        // check if email from user to get resume exists
        if($resumeUser->getParameters()) {
            $filepath = "./uploads/" .$resumeUser->resume_path;

            // Process download resume
            if(!empty($resumeUser->resume_path) && file_exists($filepath)) {

                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="'.basename($filepath).'"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($filepath));
                flush(); // Flush system output buffer
                readfile($filepath);
                die();
            } else {

                http_response_code(404);
                echo json_encode(array(
                    "message" => "File cannot found",
                    "code"=>$FILE_CANNOT_FOUND_CODE
                ));	
                die();
            }
        }
    }
    catch (Exception $e){
        // set response code
        http_response_code(401);
    
        // tell the user access denied  & show error message
        echo json_encode(array(
            "message" => "Access denied. JWT not valid.",
            "error" => $e->getMessage(),
			"code"=>$ERROR_CODE
        ));
    }
} else {
	// set response code
	http_response_code(401);
			
	// tell the user access denied  & show error message
	echo json_encode(array(
		"message" => "JWT or email doesnt exist.",
		"code"=>$ERROR_CODE
	));	
}

?>