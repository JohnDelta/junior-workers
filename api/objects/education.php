<?php

/**
 * Manage user's education from here
 */

class Education {
    private $conn;
    private $tableName = "user_has_education";

    // user to who this education belongs to
    public $id_user;
    // skill attributes
    public $id_education = array();
    public $id_education_level = array();

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // add education to user after deleting the previous ones
    // *need to fill the public skills attribute array with data first
    public function insertAll() {
        // delete all previous experience
        $this->removeAll();

        // wait for all inserts to work before commit
        $this->conn->beginTransaction();

        // make a query to insert all 
        $query = "INSERT INTO ".$this->tableName." (id_user, id_education, id_education_level)  
        VALUES (:id_user, :id_education, :id_education_level)";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize each entry given
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));
        for($i = 0; $i < count($this->id_skill); $i++) {
            $this->id_education[$i] = htmlspecialchars(strip_tags($this->id_education[$i]));
            $this->id_education_level[$i] = htmlspecialchars(strip_tags($this->id_education_level[$i]));

            // bind parameters to the prepare statement
            $stmt->bindParam(':id_education', $this->id_education[$i]);
            $stmt->bindParam(':id_education_level', $this->id_education_level[$i]);
            $stmt->bindParam(':id_user', $this->id_user);

            // execute each query
            $stmt->execute();
        }

        // commit changes
        $this->conn->commit();
    }

    // check if the user has education, if they have, get them all
    public function getAll() {
        // create the select all education query
        $query = "SELECT id_education, id_education_level FROM ".$this->tableName. "
            WHERE id_user = :id_user";

        // create statement
        $stmt = $this->conn->prepare($query);
        
        // sanitize the given value
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));

        // bind the parameter to the statement
        $stmt->bindParam(":id_user", $this->id_user);

        // execute query
        $stmt->execute();

        // if values exist, get them
        if($stmt->rowCount() > 0) {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($this->id_education, $row["id_education"]);
                array_push($this->id_education_level, $row["id_education_level"]);
            }
            return true;
        }

        return false;
    }

    // if user has education, remove them all
    public function removeAll() {
        // create query to delete entries in user_has_education
        $query = "DELETE FROM ".$this->tableName." 
            WHERE id_user = :id_user";
        
        // sanitize given parameter
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));

        // create prepare statemt
        $stmt = $this->conn->prepare($query);

        // bind parameter to statement
        $stmt->bindParam(":id_user", $this->id_user);

        // execute query
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}

?>