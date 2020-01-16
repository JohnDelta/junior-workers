<?php

/**
 * Manage user's search from here
 * 
 * takes as argument the search input from user and the 
 * search type (role : candidate or hirer) and returns all
 * users that match the search.
 */


class SearchUsers {
    private $conn;

    // user's attributes
    public $searchInput;
    public $searchType;

    public $results = array();

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    function getResults() {
        // results for candidate
        if($this->searchType == "candidate") {
            // create query
            $query = "SELECT DISTINCT user.firstname, user.lastname, user.email, user.title, user.image_path, user.role 
            FROM user, education, language, skill, user_has_language, user_has_education, user_has_skill,
                experience, profession, education_level, language_level
            WHERE 
                user.id_user = user_has_language.id_user AND
                user.id_user = user_has_education.id_user AND
                user.id_user = user_has_skill.id_user AND
                education.id_education = user_has_education.id_education AND
                language.id_language = user_has_language.id_language AND
                skill.id_skill = user_has_skill.id_skill AND
                experience.id_user = user.id_user AND
                profession.id_profession = experience.id_profession AND
                user_has_education.id_education_level = education_level.id_education_level AND
                user_has_language.id_language_level = language_level.id_language_level AND
                user.role = '".$this->searchType."' AND
                user.availability = '1' AND

                (
                    user.firstname like '%".$this->searchInput."%' OR 
                    user.lastname like '%".$this->searchInput."%' OR
                    user.bio like '%".$this->searchInput."%' OR
                    user.title like '%".$this->searchInput."%' OR
                    user.role like '%".$this->searchInput."%' OR
                    
                    education.title like '%".$this->searchInput."%' OR
                    language.title like '%".$this->searchInput."%' OR
                    skill.title like '%".$this->searchInput."%' OR
                    experience.company like '%".$this->searchInput."%' OR
                    profession.title like '%".$this->searchInput."%'
                )";

            $stmt = $this->conn->query($query);
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($this->results, array(
                    "firstname" => $row["firstname"],
                    "lastname" => $row["lastname"],
                    "title" => $row["title"],
                    "email" => $row["email"],
                    "image_path" => $row["image_path"],
                    "role" => $row["role"]
                ));
            }
        } else if($this->searchType == "hirer") {
            // create query
            $query = "SELECT DISTINCT user.firstname, user.lastname, user.email, user.title, user.image_path,
                job_post.title AS job_post_title, job_post.description, job_post.id_profession, user.role 
            FROM user, job_post, profession
            WHERE 
                user.id_user = job_post.id_user AND
                profession.id_profession = job_post.id_profession AND
                user.role = '".$this->searchType."' AND

                (
                    user.firstname like '%".$this->searchInput."%' OR 
                    user.lastname like '%".$this->searchInput."%' OR
                    user.bio like '%".$this->searchInput."%' OR
                    user.title like '%".$this->searchInput."%' OR
                    user.role like '%".$this->searchInput."%' OR
                    
                    job_post.title like '%".$this->searchInput."%' OR
                    job_post.description like '%".$this->searchInput."%' OR
                    profession.title like '%".$this->searchInput."%'
                )";

            $stmt = $this->conn->query($query);
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($this->results, array(
                    "firstname" => $row["firstname"],
                    "lastname" => $row["lastname"],
                    "title" => $row["title"],
                    "email" => $row["email"],
                    "image_path" => $row["image_path"],
                    "job_title" => $row["job_post_title"],
                    "description" => $row["description"],
                    "id_profession" => $row["id_profession"],
                    "role" => $row["role"]
                ));
            }
        }
    }
}

?>