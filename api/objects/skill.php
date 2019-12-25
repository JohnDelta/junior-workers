<?php

/**
 * Manage user's skill from here
 */

class Skill {
    private $conn;
    private $tableName = "user_has_skill";

    // user to who this skills belongs to
    public $id_user;
    // skill attributes
    public $id_skill = array();

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // add skills to user after deleting the previous ones
    // *need to fill the public skills attribute array with data first
    public function insertAll() {
        // delete all previous experience
        $this->removeAll();

        // wait for all inserts to work before commit
        $this->conn->beginTransaction();

        // make a query to insert all 
        $query = "INSERT INTO ".$this->tableName." (id_user, id_skill)  
        VALUES (:id_user, :id_skill)";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize each entry given
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));
        for($i = 0; $i < count($this->id_skill); $i++) {
            $this->id_skill[$i] = htmlspecialchars(strip_tags($this->id_skill[$i]));

            // bind parameters to the prepare statement
            $stmt->bindParam(':id_skill', $this->id_skill[$i]);
            $stmt->bindParam(':id_user', $this->id_user);

            // execute each query
            $stmt->execute();
        }

        // commit changes
        $this->conn->commit();
    }

    // check if the user has skills, if they have, get them all
    public function getAll() {
        // create the select all skill query
        $query = "SELECT id_skill FROM ".$this->tableName. "
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
                array_push($this->id_skill, $row["id_skill"]);
            }
            return true;
        }

        return false;
    }

    // if user has skills, remove them all
    public function removeAll() {
        // create query to delete entries in experience
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