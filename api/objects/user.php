<?php

/**
 * Manage user's language from here
 */

include_once("objects/experience.php");

class User {
    private $conn;
    private $tableName = "user";

    // user's attributes
    public $id_user;
    public $firstname;
    public $lastname;
    public $email;
    public $password;
    public $title;
    public $availability;
    public $role;
    public $bio;
    public $image_path;
    public $video_path;
    public $resume_path;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    function create() {
        // create query
        $query = "INSERT INTO ".$this->tableName." 
            (firstname, lastname, email, password, role) VALUES (
                :firstname, :lastname, :email, :password, :role
            )";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitaze given parameters
        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->role = htmlspecialchars(strip_tags($this->role));

        // bind parameters to the prepare statement
        $stmt->bindParam(':firstname', $this->firstname);
        $stmt->bindParam(':lastname', $this->lastname);
        $stmt->bindParam(':email', $this->email);
        $passwordHashed = password_hash($this->password, PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $passwordHashed);
        $stmt->bindParam(':role', $this->role);

        // execute query
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // given the user's email, get all their data
    function getParameters() {
        // create query to get all attributes using the  email as key
        $query = "SELECT firstname, lastname, id_user, password, title, availability, role, bio, image_path, video_path, resume_path  
            FROM ".$this->tableName." WHERE email=:email";
        
        // create statement from connection
        $stmt = $this->conn->prepare($query);

        // sanitize given email
        $this->email = htmlspecialchars(strip_tags($this->email));
        
        // bind parameter into statemnt
        $stmt->bindParam(":email", $this->email);

        // execute query
        $stmt->execute();

        // get number of results back
        $numberOfRows = $stmt->rowCount();

        if($numberOfRows > 0) {
            // user exists, update the rest of the parameters
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id_user = $row["id_user"];
            $this->firstname = $row["firstname"];
            $this->lastname = $row["lastname"];
            $this->password = $row["password"];
            $this->availability = $row["availability"];
            $this->title = $row["title"];
            $this->role = $row["role"];
            $this->bio = $row["bio"];
            $this->image_path = $row["image_path"];
            $this->video_path = $row["video_path"];
            $this->resume_path = $row["resume_path"];

            return true;
        }
        // else return false
        return false;
    }

    // given the user's email, alter their attributes
    // *NOTE : image's path can be altered from post-image.php
    function alterAll() {
        // create query to alter all attributes using the email as key
        $query = "UPDATE ".$this->tableName
            ." SET firstname=:firstname, lastname=:lastname, title=:title, availability=:availability, bio=:bio, image_path=:image_path, video_path=:video_path, resume_path=:resume_path"
            ." WHERE email=:email";
        
        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize given values
        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->availability = htmlspecialchars(strip_tags($this->availability));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->bio = htmlspecialchars(strip_tags($this->bio));
        $this->image_path = htmlspecialchars(strip_tags($this->image_path));
        $this->video_path = htmlspecialchars(strip_tags($this->video_path));
        $this->resume_path = htmlspecialchars(strip_tags($this->resume_path));

        // bind parameters into the prepare statement
        $stmt->bindParam(":firstname", $this->firstname);
        $stmt->bindParam(":lastname", $this->lastname);
        $stmt->bindParam(":availability", $this->availability);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":bio", $this->bio);
        // these two might need different function to alter. The user might manually change them..
        $stmt->bindParam(":image_path", $this->image_path);
        $stmt->bindParam(":video_path", $this->video_path);
        $stmt->bindParam(":resume_path", $this->resume_path);

        // execute query
        if($stmt->execute()){
            return true;
        } 
        return false;
    }
}

?>