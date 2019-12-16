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
    public $title = array();
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
        $query = "INSERT INTO ".$this->tableName." (title, company, date, id_user)  
        VALUES (:title, :company, :date, :id_user)";

        // create prepare statement
        $stmt = $this->conn->prepare($query);

        // sanitize each entry given
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));
        for($i = 0; $i < count($this->title); $i++) {
            $this->title[$i] = htmlspecialchars(strip_tags($this->title[$i]));
            $this->company[$i] = htmlspecialchars(strip_tags($this->company[$i]));
            $this->date[$i] = htmlspecialchars(strip_tags($this->date[$i]));

            // bind parameters to the prepare statement
            $stmt->bindParam(':title', $this->title[$i], PDO::PARAM_STR_CHAR, 100);
            $stmt->bindParam(':company', $this->title[$i], PDO::PARAM_STR_CHAR, 100);
            $stmt->bindParam(':date', $this->title[$i], PDO::PARAM_STR_CHAR, 10);
            $stmt->bindParam(':id_user', $this->id_user, PDO::PARAM_INT, 10);

            // execute each query
            $stmt->execute();
        }

        // commit changes
        $this->conn->commit();
    }

    // check if the user has experience, if they have, get them all
    public function getAll() {
        // create the select all experience query
        $query = "SELECT id_experience, title, company, date FROM ".$this->tableName. "
            WHERE id_user = :id_user";

        // create statement
        $stmt = $this->conn->prepare($query);
        
        // sanitize the given value
        $this->id_user = htmlspecialchars(strip_tags($this->id_user));

        // bind the parameter to the statement
        $stmt->bindParam(":id_user", $this->id_user, PDO::PARAM_INT, 10);

        // execute query
        $stmt->execute();

        // if values exist, get them
        if($stmt->rowCount() > 0) {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($this->id_experience, $row["id_experience"]);
                array_push($this->title, $row["title"]);
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
        $stmt->bindParam(":id_user", $this->id_user, PDO::PARAM_INT, 10);

        // execute query
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}

?>