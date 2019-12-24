<?php

/**
 * User class
 * 
 * Arguments: Needs a connection to a database
 * Public Vars:
 *  -All user parameters
 *  -Name of table users from the given database
 * 
 * Functions:
 *  Create(): Given the connection and user arguments creates a user and insert
 *            it into the database
 *  emailExists(): Given an email as public var, check if the user exists in the db,
 *             if it does return all the other info about them too.
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

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    function create() {
        // create query
        $query = "INSERT INTO ".$this->tableName." 
            (firstname, lastname, email, password) VALUES (
                :firstname, :lastname, :email, :password
            )";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitaze given parameters
        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));

        // bind parameters to the prepare statement
        $stmt->bindParam(':firstname', $this->firstname, PDO::PARAM_STR, 40);
        $stmt->bindParam(':lastname', $this->lastname, PDO::PARAM_STR, 40);
        $stmt->bindParam(':email', $this->email, PDO::PARAM_STR, 90);
        $passwordHashed = password_hash($this->password, PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $passwordHashed, PDO::PARAM_STR, 70);

        // execute query
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // given the user's email, get all their data
    function getParameters() {
        // create query to get all attributes using the  email as key
        $query = "SELECT firstname, lastname, id_user, password, title, availability FROM ".$this->tableName." WHERE email=:email";
        
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
            return true;
        }
        // else return false
        return false;
    }

    // given the user's email, alter their attributes
    function alterAll() {
        // create query to alter all attributes using the email as key
        $query = "UPDATE ".$this->tableName
            ." SET firstname=:firstname, lastname=:lastname, title=:title, availability=:availability"
            ." WHERE email=:email";
        
        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize given values
        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->availability = htmlspecialchars(strip_tags($this->availability));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->email = htmlspecialchars(strip_tags($this->email));

        // bind parameters into the prepare statement
        $stmt->bindParam(":firstname", $this->firstname);
        $stmt->bindParam(":lastname", $this->lastname);
        $stmt->bindParam(":availability", $this->availability);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":email", $this->email);

        // execute query
        if($stmt->execute()){
            return true;
        } 
        return false;
    }
}

?>