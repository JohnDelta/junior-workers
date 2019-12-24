<?php

/**
 * Manage user's work experience from here
 */

class Experience {
    private $conn;
    private $tableName = "experience";

    // user to who this experience belongs to
    public $id_user;
    // experience attributes
    public $id_experience = array();
    public $id_profession = array();
    public $company = array();
    public $date = array();

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // add experience to user after deleting the previous one
    // *need to fill the public experience attribute arrays with data first
    public function insertAll() {
        // delete all previous experience
        $this->removeAll();

        // wait for all inserts to work before commit
        $this->conn->beginTransaction();

        // make a query to insert all 
        $query = "INSERT INTO ".$this->tableName." (id_profession, company, date, id_user)  
        VALUES (:id_profession, :company, :date, :id_user)";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize each entry given
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));
        for($i = 0; $i < count($this->id_profession); $i++) {
            $this->id_profession[$i] = htmlspecialchars(strip_tags($this->id_profession[$i]));
            $this->company[$i] = htmlspecialchars(strip_tags($this->company[$i]));
            $this->date[$i] = htmlspecialchars(strip_tags($this->date[$i]));

            // bind parameters to the prepare statement
            $stmt->bindParam(':id_profession', $this->id_profession[$i]);
            $stmt->bindParam(':company', $this->company[$i]);
            $stmt->bindParam(':date', $this->date[$i]);
            $stmt->bindParam(':id_user', $this->id_user);

            // execute each query
            $stmt->execute();
        }

        // commit changes
        $this->conn->commit();
    }

    // check if the user has experience, if they have, get them all
    public function getAll() {
        // create the select all experience query
        $query = "SELECT id_experience, id_profession, company, date FROM ".$this->tableName. "
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
                array_push($this->id_experience, $row["id_experience"]);
                array_push($this->id_profession, $row["id_profession"]);
                array_push($this->company, $row["company"]);
                array_push($this->date, $row["date"]);
            }
            return true;
        }

        return false;
    }

    // if he has experience, remove it all
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