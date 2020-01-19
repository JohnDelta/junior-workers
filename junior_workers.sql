-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 20, 2020 at 12:15 AM
-- Server version: 8.0.13
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `junior_workers`
--

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id_education` int(10) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id_education`, `title`) VALUES
(12, 'UNIWA'),
(13, 'TEIATH'),
(14, 'TEIPYR');

-- --------------------------------------------------------

--
-- Table structure for table `education_level`
--

CREATE TABLE `education_level` (
  `id_education_level` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `education_level`
--

INSERT INTO `education_level` (`id_education_level`, `title`) VALUES
(10, 'Bc'),
(11, 'Ms'),
(12, 'Phd');

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `id_experience` int(10) NOT NULL,
  `company` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `id_profession` int(10) NOT NULL,
  `id_user` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`id_experience`, `company`, `date`, `id_profession`, `id_user`) VALUES
(228, 'ICEe', '4/4/19-1/1/20', 17, 18),
(230, 'ContructAE', '1/1/10-2/2/18', 19, 19),
(231, 'Google', '1-1-20/1-2-18', 16, 15),
(234, 'BingNot', '1/1/10-2/2/11', 16, 16),
(235, 'GoogleNot', '1/1/12-2/2/16', 16, 16);

-- --------------------------------------------------------

--
-- Table structure for table `job_post`
--

CREATE TABLE `job_post` (
  `id_job_post` int(10) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `title` varchar(100) NOT NULL,
  `id_user` int(10) NOT NULL,
  `id_profession` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_post`
--

INSERT INTO `job_post` (`id_job_post`, `description`, `title`, `id_user`, `id_profession`) VALUES
(36, 'As any serious graphics designer needs to know:\nC++, \nJAVA, \nC#, \nPython, \nC, \nall mastered. Each 7+ years experience', 'Looking for an awesome designer', 17, 18),
(37, 'Too bored to make coffee. So we decided to hire an intern.', 'Coffee maker needed', 17, 17),
(38, 'Need a replacement for one of our agents. No need to apply, we will find you.', 'Mi6 is looking for candidates!', 20, 16);

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id_language` int(10) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id_language`, `title`) VALUES
(11, 'Greek'),
(12, 'English'),
(13, 'French'),
(14, 'German');

-- --------------------------------------------------------

--
-- Table structure for table `language_level`
--

CREATE TABLE `language_level` (
  `id_language_level` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `language_level`
--

INSERT INTO `language_level` (`id_language_level`, `title`) VALUES
(10, 'Good'),
(11, 'Very Good'),
(12, 'Excellent');

-- --------------------------------------------------------

--
-- Table structure for table `profession`
--

CREATE TABLE `profession` (
  `id_profession` int(10) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profession`
--

INSERT INTO `profession` (`id_profession`, `title`) VALUES
(16, 'Software Engineer'),
(17, 'Biomedical Engineer'),
(18, 'Graphics Designer'),
(19, 'Civil Engineer');

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `id_skill` int(10) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `skill`
--

INSERT INTO `skill` (`id_skill`, `title`) VALUES
(22, 'Java'),
(23, 'C++'),
(24, 'C#'),
(25, 'UI/UX'),
(26, 'Autocad'),
(27, 'Photoshop');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `availability` int(11) DEFAULT '0',
  `title` varchar(100) DEFAULT NULL,
  `bio` varchar(100) DEFAULT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'candidate',
  `image_path` varchar(200) NOT NULL DEFAULT 'default.png',
  `video_path` varchar(200) DEFAULT NULL,
  `resume_path` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `email`, `password`, `firstname`, `lastname`, `availability`, `title`, `bio`, `role`, `image_path`, `video_path`, `resume_path`) VALUES
(15, 'billy@hotmail.com', '$2y$10$Gg2T6KkZwrMS5covK2D6t.A8QR4e5powBxdGNrV4c3qRNEDJ.ysja', 'Bruce', 'Lee', 1, 'The fastest kick in westeros', 'You know who i am...', 'candidate', '638531787.jpg', '', ''),
(16, 'john.deligiannis1@gmail.com', '$2y$10$UBfWUl/tK83aROClYZ5fLO5wplKXYsL1j88kSParqid83k2qFlkDm', 'John', 'Deligiannis', 1, 'Software Engineer', 'Something about yourself!!', 'candidate', '230519756.jpg', '77398741.mp4', '533229931.pdf'),
(17, 'joker@gmail.com', '$2y$10$TFFJ84h7aHmINNAqyUSxxejQByYARVMH27TdiBMsXYnOXmdnmd91q', 'George', 'Lucas', 1, 'CodeBe Industries', 'This is the company description', 'hirer', '68526414.jpg', '', ''),
(18, 'test1@gmail.com', '$2y$10$nzugOvYWRQHk/B80muzy0OoAH3WnNkMbHlLUxi1D1JpBHC5WPUVO2', 'Jason', 'Paul', 1, 'Biomedical Engineer', 'Something about my self...', 'candidate', '692125406.png', '', ''),
(19, 'test2@gmail.com', '$2y$10$ATwPQUrCEIW3QYjqJPqRyO6esYEKBihR5e4m4ZYccrEyO1I3vUhjW', 'Aaron', 'Lestrade', 1, 'Civil Engineer', 'Don\'t know..', 'candidate', '654692870.jpg', '', ''),
(20, 'joker2@gmail.com', '$2y$10$.oPFkqgDW3o8KJLiItLmdORXqQEj1N0xfwcxaW1yqv798JAvoa4.u', 'James', 'Bond', 1, 'MI6 inc', 'Contact my email for more info.', 'hirer', '279974027.png', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_has_education`
--

CREATE TABLE `user_has_education` (
  `id_user` int(10) NOT NULL,
  `id_education` int(10) NOT NULL,
  `id_user_has_education` int(10) NOT NULL,
  `id_education_level` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_has_education`
--

INSERT INTO `user_has_education` (`id_user`, `id_education`, `id_user_has_education`, `id_education_level`) VALUES
(18, 12, 107, 12),
(19, 13, 109, 10),
(15, 12, 110, 10),
(16, 12, 112, 11);

-- --------------------------------------------------------

--
-- Table structure for table `user_has_language`
--

CREATE TABLE `user_has_language` (
  `id_language` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  `id_language_level` int(10) NOT NULL,
  `id_user_has_language` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_has_language`
--

INSERT INTO `user_has_language` (`id_language`, `id_user`, `id_language_level`, `id_user_has_language`) VALUES
(13, 18, 10, 174),
(14, 18, 10, 175),
(12, 19, 12, 177),
(13, 15, 10, 178),
(11, 16, 12, 181),
(12, 16, 12, 182);

-- --------------------------------------------------------

--
-- Table structure for table `user_has_skill`
--

CREATE TABLE `user_has_skill` (
  `id_user` int(10) NOT NULL,
  `id_skill` int(10) NOT NULL,
  `id_user_has_skill` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_has_skill`
--

INSERT INTO `user_has_skill` (`id_user`, `id_skill`, `id_user_has_skill`) VALUES
(18, 26, 257),
(18, 27, 258),
(19, 26, 260),
(15, 22, 261),
(15, 25, 262),
(16, 23, 266),
(16, 24, 267),
(16, 25, 268);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id_education`);

--
-- Indexes for table `education_level`
--
ALTER TABLE `education_level`
  ADD PRIMARY KEY (`id_education_level`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id_experience`),
  ADD KEY `fk_experience_profession_idx` (`id_profession`),
  ADD KEY `fk_experience_user1_idx` (`id_user`);

--
-- Indexes for table `job_post`
--
ALTER TABLE `job_post`
  ADD PRIMARY KEY (`id_job_post`),
  ADD KEY `fk_job_post_user1_idx` (`id_user`),
  ADD KEY `fk_job_post_profession1_idx` (`id_profession`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id_language`);

--
-- Indexes for table `language_level`
--
ALTER TABLE `language_level`
  ADD PRIMARY KEY (`id_language_level`);

--
-- Indexes for table `profession`
--
ALTER TABLE `profession`
  ADD PRIMARY KEY (`id_profession`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id_skill`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `user_has_education`
--
ALTER TABLE `user_has_education`
  ADD PRIMARY KEY (`id_user_has_education`),
  ADD KEY `fk_user_has_education_education1_idx` (`id_education`),
  ADD KEY `fk_user_has_education_user1_idx` (`id_user`),
  ADD KEY `fk_user_has_education_education_level1_idx` (`id_education_level`);

--
-- Indexes for table `user_has_language`
--
ALTER TABLE `user_has_language`
  ADD PRIMARY KEY (`id_user_has_language`),
  ADD KEY `fk_language_has_user_user1_idx` (`id_user`),
  ADD KEY `fk_language_has_user_language1_idx` (`id_language`),
  ADD KEY `fk_language_has_user_language_level1_idx` (`id_language_level`);

--
-- Indexes for table `user_has_skill`
--
ALTER TABLE `user_has_skill`
  ADD PRIMARY KEY (`id_user_has_skill`),
  ADD KEY `fk_user_has_skill_skill1_idx` (`id_skill`),
  ADD KEY `fk_user_has_skill_user1_idx` (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id_education` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `education_level`
--
ALTER TABLE `education_level`
  MODIFY `id_education_level` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `id_experience` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=236;

--
-- AUTO_INCREMENT for table `job_post`
--
ALTER TABLE `job_post`
  MODIFY `id_job_post` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `language`
--
ALTER TABLE `language`
  MODIFY `id_language` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `language_level`
--
ALTER TABLE `language_level`
  MODIFY `id_language_level` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `profession`
--
ALTER TABLE `profession`
  MODIFY `id_profession` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `id_skill` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user_has_education`
--
ALTER TABLE `user_has_education`
  MODIFY `id_user_has_education` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `user_has_language`
--
ALTER TABLE `user_has_language`
  MODIFY `id_user_has_language` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT for table `user_has_skill`
--
ALTER TABLE `user_has_skill`
  MODIFY `id_user_has_skill` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=269;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `fk_experience_profession` FOREIGN KEY (`id_profession`) REFERENCES `profession` (`id_profession`),
  ADD CONSTRAINT `fk_experience_user1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `job_post`
--
ALTER TABLE `job_post`
  ADD CONSTRAINT `fk_job_post_profession1` FOREIGN KEY (`id_profession`) REFERENCES `profession` (`id_profession`),
  ADD CONSTRAINT `fk_job_post_user1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `user_has_education`
--
ALTER TABLE `user_has_education`
  ADD CONSTRAINT `fk_user_has_education_education1` FOREIGN KEY (`id_education`) REFERENCES `education` (`id_education`),
  ADD CONSTRAINT `fk_user_has_education_education_level1` FOREIGN KEY (`id_education_level`) REFERENCES `education_level` (`id_education_level`),
  ADD CONSTRAINT `fk_user_has_education_user1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `user_has_language`
--
ALTER TABLE `user_has_language`
  ADD CONSTRAINT `fk_language_has_user_language1` FOREIGN KEY (`id_language`) REFERENCES `language` (`id_language`),
  ADD CONSTRAINT `fk_language_has_user_language_level1` FOREIGN KEY (`id_language_level`) REFERENCES `language_level` (`id_language_level`),
  ADD CONSTRAINT `fk_language_has_user_user1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `user_has_skill`
--
ALTER TABLE `user_has_skill`
  ADD CONSTRAINT `fk_user_has_skill_skill1` FOREIGN KEY (`id_skill`) REFERENCES `skill` (`id_skill`),
  ADD CONSTRAINT `fk_user_has_skill_user1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
