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
 */

class User {
    private $conn;
    private $tableName = "users";

    public $id;
    public $firstname;
    public $lastname;
    public $email;
    public $password;

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
}

?>