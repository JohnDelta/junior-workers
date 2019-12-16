<?php

// Get mySql database connection here

class Database {

    private $host = "localhost";
    private $username = "pma";
	private $password = "026849";
	private $dbName = "junior_workers";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=".$this->host.";".
                "dbname=".$this->dbName,
                $this->username,
                $this->password
            );
            
            // set the PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch(PDOException $exception) {
            echo "Connection Error : ".$exception->getMessage();
        }
        return $this->conn;
    }
}

?>