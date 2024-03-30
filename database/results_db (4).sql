-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2024 at 06:43 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `results_db`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `regSep` (`reg_or_sup` INT) RETURNS VARCHAR(20) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
    DECLARE result VARCHAR(20);
    
    IF reg_or_sup = 1 THEN
        SET result = 'Regular';
    ELSE
        SET result = 'Supplementary';
    END IF;
    
    RETURN result;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `toRoman` (`num` INT) RETURNS VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
    DECLARE result VARCHAR(255);
    DECLARE numbers   INT DEFAULT 1;
    DECLARE romans    VARCHAR(15);

    DECLARE CONTINUE HANDLER FOR SQLSTATE '22003' SET numbers = NULL;
    
    SET romans = 'I,IV,V,IX,X,XL,L,XC,C,CD,D,CM,M';
    SET result = '';

    WHILE num > 0 DO
        SELECT SUBSTRING_INDEX(romans, ',', num DIV numbers + 1) INTO romans;
        SELECT SUBSTRING_INDEX(romans, ',', -1) INTO result;
        SET num = num - numbers * (num DIV numbers);
        SET numbers = numbers * 10;
    END WHILE;

    RETURN result;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `all_students`
--

CREATE TABLE `all_students` (
  `roll_number` varchar(15) NOT NULL,
  `student_name` text NOT NULL,
  `branch` varchar(10) NOT NULL,
  `AY_admitted` varchar(10) DEFAULT NULL,
  `admission_category` varchar(10) DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `eamcet_number` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `all_students`
--

INSERT INTO `all_students` (`roll_number`, `student_name`, `branch`, `AY_admitted`, `admission_category`, `gender`, `eamcet_number`, `dob`) VALUES
('20KA1A00172', 'Doctor Strange', 'CSE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0182', 'Ramarao', 'CIVIL', '2020-21', 'OC', 'MALE', '3213', '2002-09-12'),
('20KA1A0272', 'Peter Parker', 'EEE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0472', 'Abdul Mateen', 'ECE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0523', 'L. Bharath', 'CSE', '2020-21', 'OC', 'OTHERS', '121212', '2004-05-31'),
('20KA1A0525', 'V. M. Vishnu', 'CSE', '2020-21', 'SC', 'MALE', '12121', '2004-09-04'),
('20KA1A0526', 'T. S. Nithin', 'CSE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0572', 'BackLog Bhargav', 'CSE', '2017-18', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0573', 'Kabali', 'MECH', '2020-21', 'BC-A', 'MALE', '121212', '2002-09-12'),
('20KA1A0574', 'Rocket', 'FDT', '2020-21', 'SC', 'MALE', '121212', '2002-09-12'),
('20KA1A0575', 'Groot ', 'EEE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0576', 'Naan Sirithaal', 'CSE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0577', 'TONY Stark', 'CSE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0578', 'Okkadu', 'ECE', '2020-21', 'BC-B', 'MALE', '121212', '2002-09-12'),
('20KA1A0579', 'M. Abninav', 'CSE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA1A0580', 'Patil ', 'CSE', '2020-21', 'OC', 'FEMALE', '3475', '2002-04-09'),
('20KA1A0592', 'Ethan Hunt', 'CSE', '2020-21', 'EWS', 'MALE', '3213', '2002-09-13'),
('20KA1A05K0', 'Abdul Mateen', 'ECE', '2020-21', 'OC', 'MALE', '121212', '2002-09-12'),
('20KA5A05102', 'Jack Reacher', 'ECE', '2020-21', 'BC-A', 'MALE', '3213', '2002-09-14'),
('20KA5A05103', 'Thathatarigada', 'MECH', '2020-21', 'BC-D', 'FEMALE', '3213', '2002-09-15'),
('20KA5A05104', 'Kerala Boy', 'EEE', '2020-21', 'SC', 'MALE', '3213', '2002-09-16'),
('20KA5A05105', 'ThomTHom', 'FDT', '2020-21', 'ST', 'OTHERS', '3213', '2002-09-17');

-- --------------------------------------------------------

--
-- Table structure for table `regulations`
--

CREATE TABLE `regulations` (
  `academic_year` int(11) NOT NULL,
  `academic_sem` int(11) NOT NULL,
  `regulation` varchar(5) NOT NULL,
  `reg_or_sup` int(1) NOT NULL,
  `results_date` date NOT NULL,
  `exam_month` varchar(30) NOT NULL,
  `exam_year` year(4) DEFAULT NULL,
  `link_id` varchar(255) NOT NULL,
  `reg_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regulations`
--

INSERT INTO `regulations` (`academic_year`, `academic_sem`, `regulation`, `reg_or_sup`, `results_date`, `exam_month`, `exam_year`, `link_id`, `reg_text`) VALUES
(1, 1, 'R20', 0, '2024-02-09', 'August/September', '2023', '110R20Aug2023', 'I Year I Semester (R20) Supplementary Examinations, August/September 2023'),
(1, 1, 'R20', 0, '2024-02-22', 'December', '2022', '110R20Dec2022', 'I Year I Semester (R20) Supplementary Examinations, December 2022'),
(1, 1, 'R20', 0, '2024-01-18', 'October', '2019', '110R20Oct2019', 'I Year I Semester (R20) Supplementary Examinations, October 2019'),
(1, 1, 'R20', 0, '2024-01-23', 'September', '2019', '110R20Sep2019', 'I Year I Semester (R20) Supplementary Examinations, September 2019'),
(1, 1, 'R20', 1, '2024-01-31', 'August/September', '2020', '111R20Aug2020', 'I Year I Semester (R20) Regular Examinations, August/September 2020'),
(1, 1, 'R20', 1, '2024-01-31', 'November/December', '2020', '111R20Nov2020', 'I Year I Semester (R20) Regular Examinations, November/December 2020'),
(1, 2, 'R20', 0, '2024-01-12', 'September', '2019', '120R20Sep2019', 'I Year II Semester (R20) Supplementary Examinations, September 2019'),
(1, 2, 'R20', 1, '2024-01-31', 'August/September', '2021', '121R20Aug2021', 'I Year II Semester (R20) Regular Examinations, August/September 2021'),
(1, 2, 'R20', 1, '2024-01-24', 'September', '2019', '121R20Sep2019', 'I Year II Semester (R20) Regular Examinations, September 2019'),
(2, 1, 'R200', 1, '2024-02-26', 'September', '2023', '211R200Sep2023', 'II Year I Semester (R200) Regular/Supplementary Examinations, September 2023'),
(2, 1, 'R20', 1, '2024-01-31', 'August/September', '2022', '211R20Aug2022', 'II Year I Semester (R20) Regular Examinations, August/September 2022'),
(2, 2, 'R19', 0, '2024-02-22', 'September', '2019', '220R19Sep2019', 'II Year II Semester (R19) Regular Examinations, September 2019'),
(2, 2, 'R20', 1, '2024-01-12', 'September', '2019', '221R20Sep2019', 'II Year II Semester (R20) Regular Examinations, September 2019'),
(2, 2, 'R30', 1, '2024-01-01', 'May/July', '2023', '221R30May2023', 'II Year II Semester (R30) Regular Examinations, May/July 2023'),
(3, 1, 'R20', 1, '2024-01-13', 'August/September', '2023', '311R20Aug2023', 'III Year I Semester (R20) Regular Examinations, August/September 2023'),
(3, 1, 'R20', 1, '2024-01-12', 'September', '2019', '311R20Sep2019', 'III Year I Semester (R20) Regular Examinations, September 2019'),
(3, 1, 'R20', 1, '2024-01-15', 'September', '2020', '311R20Sep2020', 'III Year I Semester (R20) Regular Examinations, September 2020'),
(3, 2, 'R20', 1, '2024-01-28', 'August/September', '2023', '321R20Aug2023', 'III Year II Semester (R20) Regular Examinations, August/September 2023'),
(3, 2, 'R20', 1, '2024-01-12', 'September', '2019', '321R20Sep2019', 'III Year II Semester (R20) Regular Examinations, September 2019'),
(4, 1, 'R111', 1, '2024-01-01', 'September', '2019', '411R111Sep2019', 'IV Year I Semester (R111) Regular Examinations, September 2019'),
(4, 1, 'R20', 1, '2024-01-26', 'August/September', '2023', '411R20Aug2023', 'IV Year I Semester (R20) Regular Examinations, August/September 2023'),
(4, 2, 'R20', 1, '2024-01-16', 'August/September', '2023', '421R20Aug2023', 'IV Year II Semester (R20) Regular Examinations, August/September 2023'),
(4, 2, 'R18', 1, '2024-01-12', 'September', '2019', '421R20Sep2019', 'IV Year II Semester (R18) Regular Examinations, September undefined');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(50) NOT NULL,
  `internal_marks` int(11) NOT NULL,
  `external_marks` int(11) NOT NULL,
  `total_marks` int(11) NOT NULL,
  `grade` varchar(1) NOT NULL,
  `credits` float NOT NULL,
  `pass_or_fail` text DEFAULT NULL,
  `roll_number` text DEFAULT NULL,
  `regulation_id` varchar(20) DEFAULT NULL,
  `id` varchar(255) NOT NULL,
  `reg_or_sup` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`subject_code`, `subject_name`, `internal_marks`, `external_marks`, `total_marks`, `grade`, `credits`, `pass_or_fail`, `roll_number`, `regulation_id`, `id`, `reg_or_sup`) VALUES
('20A9901D1213bj', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D1213bj311R20Sep2020', '1'),
('20A9901D123hjkb', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D123hjkb311R20Sep2020', '1'),
('20A9901D123j21hb3', '3D Printing', 24, 65, 89, 'A', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D123j21hb3311R20Sep2020', '1'),
('20A9901D123kjbh', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D123kjbh311R20Sep2020', '1'),
('20A9901D12k3jbj12b3', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D12k3jbj12b3311R20Sep2020', '1'),
('20A9901D12k3kg12', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D12k3kg12311R20Sep2020', '1'),
('20A9901D21312312', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D21312312311R20Sep2020', '1'),
('20A9901D3123b', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901D3123b311R20Sep2020', '1'),
('20A9901Djk213b', 'Data Structures', 26, 65, 91, 's', 3, 'PASS', '20KA1A0272', '311R20Sep2020', '20KA1A027220A9901Djk213b311R20Sep2020', '1'),
('20A073036', 'Java Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A073036111R20Aug2020', '1'),
('20A07329', 'MACHINE LEARNING', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A07329111R20Aug2020', '1'),
('20A07331', 'Artificial Intelligence', 25, 47, 72, 'B', 1.5, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A07331111R20Aug2020', '1'),
('20A07334', 'Computer Networks', 25, 61, 86, 'A', 3, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A07334111R20Aug2020', '1'),
('20A07336', 'Discrete Mathematics & Graph Theory', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A07336111R20Aug2020', '1'),
('20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A07A436111R20Aug2020', '1'),
('20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 64, 89, 'A', 1.5, 'PASS', '20KA1A0523', '111R20Aug2020', '20KA1A052320A09A3006111R20Aug2020', '1'),
('20A073036', 'Java Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0526', '111R20Aug2020', '20KA1A052620A073036111R20Aug2020', '1'),
('20A0732123213', 'Community Service Project', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '411R20Aug2023', '20KA1A052620A0732123213411R20Aug2023', '1'),
('20A0732911111111', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A0732911111111221R20May2023', '1'),
('20A073291111', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A073291111221R20May2023', '1'),
('20A0732912', 'MACHINE LEARNING', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '121R20Aug2021', '20KA1A052620A0732912121R20Aug2021', '1'),
('20A0732912', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '211R20Aug2022', '20KA1A052620A0732912211R20Aug2022', '1'),
('20A073291231231', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A073291231231221R30May2023', '1'),
('20A0732912321', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A0732912321221R30May2023', '1'),
('20A07329123', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A07329123221R30May2023', '1'),
('20A07329126837521', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A07329126837521311R20Sep2020', '1'),
('20A073291273512873', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A073291273512873311R20Sep2020', '1'),
('20A0732912bv3v21kl3', 'Community Service Project', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A0732912bv3v21kl3321R20Aug2023', '1'),
('20A0732912g3f21f', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A0732912g3f21f311R20Sep2020', '1'),
('20A0732912hjg3l12k', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A0732912hjg3l12k321R20Aug2023', '1'),
('20A0732912j3hvbv', 'Engineering  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '211R20Aug2022', '20KA1A052620A0732912j3hvbv211R20Aug2022', '1'),
('20A07329162753', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A07329162753311R20Sep2020', '1'),
('20A073291hj2v3121', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A073291hj2v3121311R20Sep2020', '1'),
('20A073291k2hjkh3bg', 'Final year Project', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '421R20Aug2023', '20KA1A052620A073291k2hjkh3bg421R20Aug2023', '1'),
('20A0732921jh321kj3n', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A0732921jh321kj3n321R20Aug2023', '1'),
('20A0732921k3hv12jk3', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A0732921k3hv12jk3321R20Aug2023', '1'),
('20A0732921lkn3kj21', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A0732921lkn3kj21321R20Aug2023', '1'),
('20A073292313', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A073292313221R30May2023', '1'),
('20A0732923n12lk3', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A0732923n12lk3321R20Aug2023', '1'),
('20A073292jh3g213', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A073292jh3g213321R20Aug2023', '1'),
('20A073292kj3gh12kj', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A073292kj3gh12kj321R20Aug2023', '1'),
('20A073292l13hl21', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A073292l13hl21311R20Sep2020', '1'),
('20A073292y13t6271', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A073292y13t6271311R20Sep2020', '1'),
('20A073293123143', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '221R30May2023', '20KA1A052620A073293123143221R30May2023', '1'),
('20A073293yg12y3g', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A073293yg12y3g311R20Sep2020', '1'),
('20A07329djsbfldsf', 'Database Management Systems', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '211R20Aug2022', '20KA1A052620A07329djsbfldsf211R20Aug2022', '1'),
('20A07329j213bljk12', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '321R20Aug2023', '20KA1A052620A07329j213bljk12321R20Aug2023', '1'),
('20A07329jh2jg3gy', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '311R20Sep2020', '20KA1A052620A07329jh2jg3gy311R20Sep2020', '1'),
('20A07329sdkfhb', 'ENGINEERING  WORKSHOP', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '121R20Aug2021', '20KA1A052620A07329sdkfhb121R20Aug2021', '1'),
('20A07329skdhfb', 'Database Management Systems', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', '121R20Aug2021', '20KA1A052620A07329skdhfb121R20Aug2021', '1'),
('20A07334', 'Artificial Intelligence', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', '121R20Aug2021', '20KA1A052620A07334121R20Aug2021', '1'),
('20A0733412h3b', 'Cryptography and Network Security', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', '211R20Aug2022', '20KA1A052620A0733412h3b211R20Aug2022', '1'),
('20A07334dsjhfbds', 'OPERATING SYSTEMS', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', '121R20Aug2021', '20KA1A052620A07334dsjhfbds121R20Aug2021', '1'),
('20A07334sdfjhbsdf', 'Operating Systems', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', '211R20Aug2022', '20KA1A052620A07334sdfjhbsdf211R20Aug2022', '1'),
('20A07334sidfu', 'Advanced Web Application Development', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', '211R20Aug2022', '20KA1A052620A07334sidfu211R20Aug2022', '1'),
('20A07334skdhfb', 'ADVANCED WEB APPLICATION DEVELOPMENT', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', '121R20Aug2021', '20KA1A052620A07334skdhfb121R20Aug2021', '1'),
('20A07336', 'Discrete Mathematics & Graph Theory', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0526', '111R20Aug2020', '20KA1A052620A07336111R20Aug2020', '1'),
('20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A0526', '111R20Aug2020', '20KA1A052620A07A436111R20Aug2020', '1'),
('20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 64, 89, 'A', 1.5, 'PASS', '20KA1A0526', '111R20Aug2020', '20KA1A052620A09A3006111R20Aug2020', '1'),
('20A0A70981', 'CLOUD COMPUTING', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0526', '111R20Aug2020', '20KA1A052620A0A70981111R20Aug2020', '1'),
('20A0A709899', 'HUMAN VALUES', 25, 0, 25, 'S', 0, 'PASS', '20KA1A0526', '111R20Aug2020', '20KA1A052620A0A709899111R20Aug2020', '1'),
('20A073036', 'Java Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0572', '111R20Nov2020', '20KA1A057220A073036111R20Nov2020', '1'),
('20A09A3006', 'Some Backlog Subject', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0572', '110R20Dec2022', '20KA1A057220A073349wde8f110R20Dec2022', '0'),
('20A07336', 'Discrete Mathematics & Graph Theory', 25, 15, 40, 'F', 3, 'FAIL', '20KA1A0572', '111R20Nov2020', '20KA1A057220A07336111R20Nov2020', '1'),
('20A07336', 'DISCRETE MATHEMATICS & GRAPH THEORY', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '110R20Oct2019', '20KA1A057220A07336123hb21110R20Oct2019', '0'),
('20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A0572', '111R20Nov2020', '20KA1A057220A07A436111R20Nov2020', '1'),
('20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 15, 40, 'A', 1.5, 'FAIL', '20KA1A0572', '111R20Nov2020', '20KA1A057220A09A3006111R20Nov2020', '1'),
('20A9901D123b21', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901D123b21221R20Sep2019', '1'),
('20A9901D123hb21', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901D123hb21221R20Sep2019', '1'),
('20A9901Ddsai7dsaod', 'APPLIED PHYSICS', 25, 15, 40, 'F', 3, 'FAIL', '20KA1A0572', '121R20Sep2019', '20KA1A057220A9901D123hg2g13121R20Sep2019', '1'),
('20A9901D123mb21', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901D123mb21221R20Sep2019', '1'),
('20A9901D12j3hg12k', 'CHEMISTRY', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0572', '121R20Sep2019', '20KA1A057220A9901D12j3hg12k121R20Sep2019', '1'),
('20A9901D12j3jhv12kj3', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901D12j3jhv12kj3221R20Sep2019', '1'),
('20A9901D12jh3123', 'ROBOTICS', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', '121R20Sep2019', '20KA1A057220A9901D12jh3123121R20Sep2019', '1'),
('20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '211R200Sep2023', '20KA1A057220A9901D211R200Sep2023', '1'),
('20A9901Ddweoubd', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'FAIL', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901D213kjh21221R20Sep2019', '1'),
('20A9901D213uh1', 'INTEGRAL CALCULUS', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', '121R20Sep2019', '20KA1A057220A9901D213uh1121R20Sep2019', '1'),
('20A9901D21k3bh', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901D21k3bh221R20Sep2019', '1'),
('20A9901D2kj3bb213', '3D PRINTING', 24, 65, 89, 'A', 3, 'PASS', '20KA1A0572', '121R20Sep2019', '20KA1A057220A9901D2kj3bb213121R20Sep2019', '1'),
('20A9901Dasdjbsa', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dasdjbsa311R20Sep2019', '1'),
('20A9901Dashdgsad', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dashdgsad311R20Sep2019', '1'),
('20A9901Dasjdghvvsad', 'Chemistry', 22, 65, 87, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dasjdghvvsad311R20Sep2019', '1'),
('20A9901Daslkdjajoi', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Daslkdjajoi321R20Sep2019', '1'),
('20A9901Ddais7dusa', '3D Printing', 24, 65, 89, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddais7dusa321R20Sep2019', '1'),
('20A9901Ddaisukd', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddaisukd321R20Sep2019', '1'),
('20A9901Ddasg8sa7udy', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddasg8sa7udy321R20Sep2019', '1'),
('20A9901Ddhasi7du', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddhasi7du321R20Sep2019', '1'),
('20A9901Ddiasudjd', 'Chemistry', 22, 65, 87, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddiasudjd321R20Sep2019', '1'),
('20A9901Ddjshabd', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddjshabd321R20Sep2019', '1'),
('20A9901Ddouasgdl', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Ddouasgdl311R20Sep2019', '1'),
('20A9901Dds76asd', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dds76asd311R20Sep2019', '1'),
('20A9901Ddsai7dsaod', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '120R20Sep2019', '20KA1A057220A9901Ddsai7dsaod120R20Sep2019', '0'),
('20A9901Ddsai7dy', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddsai7dy321R20Sep2019', '1'),
('20A9901Ddsajhdsakdj', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0572', '321R20Sep2019', '20KA1A057220A9901Ddsajhdsakdj321R20Sep2019', '1'),
('20A9901Ddweoubd', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '220R19Sep2019', '20KA1A057220A9901Ddweoubd220R19Sep2019', '0'),
('20A9901Dmasndb', 'Chemistry', 22, 65, 87, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901Dmasndb221R20Sep2019', '1'),
('20A9901Dsadkjhsdbl', '3D Printing', 24, 65, 89, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dsadkjhsdbl311R20Sep2019', '1'),
('20A9901Dsajhdgsa67u', '3D Printing', 24, 65, 89, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901Dsajhdgsa67u221R20Sep2019', '1'),
('20A9901Dsaudt67a', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dsaudt67a311R20Sep2019', '1'),
('20A9901Dsd6asfd87', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dsd6asfd87311R20Sep2019', '1'),
('20A9901Dsdiasyd8', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '411R111Sep2019', '20KA1A057220A9901Dsdiasyd8411R111Sep2019', '1'),
('20A9901Dskdhvas', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', '221R20Sep2019', '20KA1A057220A9901Dskdhvas221R20Sep2019', '1'),
('20A9901Dsuydga6ui6', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', '311R20Sep2019', '20KA1A057220A9901Dsuydga6ui6311R20Sep2019', '1'),
('20A9901D', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0573', '211R200Sep2023', '20KA1A057320A9901D211R200Sep2023', '1'),
('20A9901Dasd9s8d', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0573', '411R111Sep2019', '20KA1A057320A9901Dasd9s8d411R111Sep2019', '1'),
('20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0574', '211R200Sep2023', '20KA1A057420A9901D211R200Sep2023', '1'),
('20A9901Dais7d6asd', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0574', '421R20Sep2019', '20KA1A057420A9901Dais7d6asd421R20Sep2019', '1'),
('20A9901Dsid8usad', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0574', '411R111Sep2019', '20KA1A057420A9901Dsid8usad411R111Sep2019', '1'),
('20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0575', '211R200Sep2023', '20KA1A057520A9901D211R200Sep2023', '1'),
('20A9901Daasdsa88d6y', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0575', '421R20Sep2019', '20KA1A057520A9901Daasdsa88d6y421R20Sep2019', '1'),
('20A9901Ddas7idsaud', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0575', '411R111Sep2019', '20KA1A057520A9901Ddas7idsaud411R111Sep2019', '1'),
('20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0576', '211R200Sep2023', '20KA1A057620A9901D211R200Sep2023', '1'),
('20A9901Ddoasdiasipd', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0576', '411R111Sep2019', '20KA1A057620A9901Ddoasdiasipd411R111Sep2019', '1'),
('20A9901Dyrd67', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0576', '421R20Sep2019', '20KA1A057620A9901Dyrd67421R20Sep2019', '1'),
('20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0577', '211R200Sep2023', '20KA1A057720A9901D211R200Sep2023', '1'),
('20A9901D75fv7i', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0577', '421R20Sep2019', '20KA1A057720A9901D75fv7i421R20Sep2019', '1'),
('20A9901Dsdao8sad', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0577', '411R111Sep2019', '20KA1A057720A9901Dsdao8sad411R111Sep2019', '1'),
('20A9901D', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0578', '211R200Sep2023', '20KA1A057820A9901D211R200Sep2023', '1'),
('20A9901D3e3u', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0578', '421R20Sep2019', '20KA1A057820A9901D3e3u421R20Sep2019', '1'),
('20A9901Dasd8sa7ud', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0578', '411R111Sep2019', '20KA1A057820A9901Dasd8sa7ud411R111Sep2019', '1'),
('20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0579', '211R200Sep2023', '20KA1A057920A9901D211R200Sep2023', '1'),
('20A9901Ddasd76ysh', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0579', '411R111Sep2019', '20KA1A057920A9901Ddasd76ysh411R111Sep2019', '1'),
('20A9901Dwiow', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0579', '421R20Sep2019', '20KA1A057920A9901Dwiow421R20Sep2019', '1'),
('20A9901Dasud7yghasho', '3D Printing', 24, 65, 89, 'A', 3, 'PASS', '20KA1A0580', '411R111Sep2019', '20KA1A058020A9901Dasud7yghasho411R111Sep2019', '1'),
('20A9901Dw287834gr', '3D Printing', 24, 14, 38, 'A', 3, 'FAIL', '20KA1A0580', '421R20Sep2019', '20KA1A058020A9901Dw287834gr421R20Sep2019', '1'),
('20A9901D', 'Java Programming Lab', 25, 15, 40, 'F', 1.5, 'FAIL', '20KA1A05K0', '211R20Aug2022', '20KA1A05k020A073036211R20Aug2022', '1'),
('20A07336', 'Discrete Mathematics & Graph Theory', 25, 65, 90, 'S', 3, 'PASS', '20KA1A05K0', '211R20Aug2022', '20KA1A05k020A07336211R20Aug2022', '1'),
('20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A05K0', '211R20Aug2022', '20KA1A05K020A07A436211R20Aug2022', '1'),
('20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 64, 89, 'A', 1.5, 'PASS', '20KA1A05K0', '211R20Aug2022', '20KA1A05K020A09A3006211R20Aug2022', '1'),
('20A9901D', 'Java Programming lab', 24, 65, 89, 'A', 3, 'PASS', '20KA1A05K0', '211R200Sep2023', '20KA1A05K020A9901D211R200Sep2023', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `all_students`
--
ALTER TABLE `all_students`
  ADD PRIMARY KEY (`roll_number`);

--
-- Indexes for table `regulations`
--
ALTER TABLE `regulations`
  ADD PRIMARY KEY (`link_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
