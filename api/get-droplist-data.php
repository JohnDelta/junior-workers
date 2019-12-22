<?php

// Return all education - skill - profession data to fill the selects

// required headers
// LATER ON RELEASE CHANGE AGAIN THIS HEADER
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//https://stackoverflow.com/questions/8719276/cors-with-php-headers
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: GET, OPTIONS");         
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
}
$data = json_decode(file_get_contents("php://input"));
// include database and experience scripts
include_once("config/database.php");

// get database connection
$database = new Database();
$conn = $database->getConnection();

$skill = array();
$profession = array();
$education = array();

try {
    //get all skills
    $query = "SELECT * FROM skill";
    $stmt = $conn->query($query);
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($skill, array(
            "id_skill" => $row["id_skill"],
            "title" => $row["title"]
        ));
    }

    //get all professions
    $query = "SELECT * FROM profession";
    $stmt = $conn->query($query);
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($profession, array(
            "id_profession" => $row["id_profession"],
            "title" => $row["title"]
        ));
    }

    //get all education
    $query = "SELECT * FROM education";
    $stmt = $conn->query($query);
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($education, array(
            "id_education" => $row["id_education"],
            "title" => $row["title"]
        ));
    }

    // set response code
    http_response_code(200);
        
    // send json
    echo json_encode(array(
        "skill" => $skill,
        "education" => $education,
        "profession" => $profession
    ));
    
} catch(Exception $e) {
    // set response code
    http_response_code(400);
        
    // send json
    echo json_encode(array(
        "Message" => $e->getMessage()
    ));
}

?>