<?php

/**
 * Manage user's job posts from here
 */

class JobPost {
    private $conn;
    private $tableName = "job_post";

    // user to who this experience belongs to
    public $id_user;
    // experience attributes
    public $id_job_post = array();
    public $id_profession = array();
    public $title = array();
    public $description = array();

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // add job post to user after deleting the previous one
    // *need to fill the public job post attribute arrays with data first
    public function insertAll() {
        // delete all previous experience
        $this->removeAll();

        // wait for all inserts to work before commit
        $this->conn->beginTransaction();

        // make a query to insert all 
        $query = "INSERT INTO ".$this->tableName." (id_profession, title, description, id_user)  
        VALUES (:id_profession, :title, :description, :id_user)";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize each entry given
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));
        for($i = 0; $i < count($this->id_profession); $i++) {
            $this->id_profession[$i] = htmlspecialchars(strip_tags($this->id_profession[$i]));
            $this->title[$i] = htmlspecialchars(strip_tags($this->title[$i]));
            $this->description[$i] = htmlspecialchars(strip_tags($this->description[$i]));

            // bind parameters to the prepare statement
            $stmt->bindParam(':id_profession', $this->id_profession[$i]);
            $stmt->bindParam(':title', $this->title[$i]);
            $stmt->bindParam(':description', $this->description[$i]);
            $stmt->bindParam(':id_user', $this->id_user);

            // execute each query
            $stmt->execute();
        }

        // commit changes
        $this->conn->commit();
    }

    // check if the user has job post, if they have, get them all
    public function getAll() {
        // create the select all experience query
        $query = "SELECT id_job_post, id_profession, title, description FROM ".$this->tableName. "
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
                array_push($this->id_job_post, $row["id_job_post"]);
                array_push($this->id_profession, $row["id_profession"]);
                array_push($this->title, $row["title"]);
                array_push($this->description, $row["description"]);
            }
            return true;
        }

        return false;
    }

    // if he has job post, remove it all
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