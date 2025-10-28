-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 28, 2025 at 08:16 AM
-- Server version: 8.4.6
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toys_r_us`
--
CREATE DATABASE IF NOT EXISTS `toys_r_us` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `toys_r_us`;

-- --------------------------------------------------------

--
-- Table structure for table `audiences`
--

CREATE TABLE `audiences` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audiences`
--

INSERT INTO `audiences` (`id`, `name`, `created_at`, `updated_at`) VALUES
('11111111-aaaa-4aaa-baaa-111111111111', 'Toddlers', '2025-10-28 08:15:06', '2025-10-28 08:15:06'),
('22222222-bbbb-4bbb-bbbb-222222222222', 'Kids', '2025-10-28 08:15:06', '2025-10-28 08:15:06'),
('33333333-cccc-4ccc-bccc-333333333333', 'Teens', '2025-10-28 08:15:06', '2025-10-28 08:15:06'),
('44444444-dddd-4ddd-bddd-444444444444', 'Adults', '2025-10-28 08:15:06', '2025-10-28 08:15:06'),
('55555555-eeee-4eee-beee-555555555555', 'Pro Gamers', '2025-10-28 08:15:06', '2025-10-28 08:15:06'),
('66666666-ffff-4fff-bfff-666666666666', 'Sports Fans', '2025-10-28 08:15:06', '2025-10-28 08:15:06');

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `audience_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `price` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `audience_id`, `name`, `description`, `price`, `created_at`, `updated_at`) VALUES
('4288f300-b3d6-11f0-8787-3200f77782f3', '11111111-aaaa-4aaa-baaa-111111111111', 'Soft Blocks', 'Colorful soft blocks for stacking and learning shapes', 25, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('4288fe20-b3d6-11f0-8787-3200f77782f3', '11111111-aaaa-4aaa-baaa-111111111111', 'Rattle Toy', 'Simple sound toy to stimulate senses', 15, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('4288ff47-b3d6-11f0-8787-3200f77782f3', '11111111-aaaa-4aaa-baaa-111111111111', 'Shape Sorter', 'Classic toy for motor skills and color recognition', 35, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('4288ffa5-b3d6-11f0-8787-3200f77782f3', '11111111-aaaa-4aaa-baaa-111111111111', 'Stacking Rings', 'Motor skill developing stacking toy', 20, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('4288fffb-b3d6-11f0-8787-3200f77782f3', '11111111-aaaa-4aaa-baaa-111111111111', 'Baby Drum', 'Light and sound drum for toddlers', 40, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428900c6-b3d6-11f0-8787-3200f77782f3', '22222222-bbbb-4bbb-bbbb-222222222222', 'Lego Junior', 'Building fun for kids aged 5-8', 79, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890154-b3d6-11f0-8787-3200f77782f3', '22222222-bbbb-4bbb-bbbb-222222222222', 'Animal Domino', 'Domino game with cute animal drawings', 39, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428901d1-b3d6-11f0-8787-3200f77782f3', '22222222-bbbb-4bbb-bbbb-222222222222', 'Disney Puzzle', '100-piece puzzle featuring Disney characters', 49, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428902a1-b3d6-11f0-8787-3200f77782f3', '22222222-bbbb-4bbb-bbbb-222222222222', 'Superhero Memory', 'Memory game for improving concentration', 29, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890337-b3d6-11f0-8787-3200f77782f3', '22222222-bbbb-4bbb-bbbb-222222222222', 'Junior Monopoly', 'Classic board game for young kids', 59, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428903de-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', 'Uno', 'Popular card game for everyone', 39, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428904b5-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', 'Taki', 'Fast-paced Israeli card game', 35, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890555-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', 'Catan Junior', 'Strategic game designed for younger players', 89, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890637-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', '3D Puzzle Tower', 'Build a 3D Eiffel Tower puzzle', 69, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428906e3-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', 'Word Sprint', 'Fast word matching game for teens', 45, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('4289079b-b3d6-11f0-8787-3200f77782f3', '44444444-dddd-4ddd-bddd-444444444444', 'Poker Set', 'Professional poker chips and cards', 99, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890847-b3d6-11f0-8787-3200f77782f3', '44444444-dddd-4ddd-bddd-444444444444', 'Chess Deluxe', 'Luxury wooden chess board', 129, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('428908e5-b3d6-11f0-8787-3200f77782f3', '44444444-dddd-4ddd-bddd-444444444444', 'Trivia Master', '2,000 general knowledge questions', 89, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890978-b3d6-11f0-8787-3200f77782f3', '44444444-dddd-4ddd-bddd-444444444444', 'Risk', 'Classic strategy and world domination board game', 149, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890a22-b3d6-11f0-8787-3200f77782f3', '44444444-dddd-4ddd-bddd-444444444444', 'Codenames', 'Team word association game', 99, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890aa4-b3d6-11f0-8787-3200f77782f3', '55555555-eeee-4eee-beee-555555555555', 'Esports Challenge', 'Online competitive game simulator', 199, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890ae4-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', 'Freebie Game', 'A promotional free game (price = 0)', 0, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890ba0-b3d6-11f0-8787-3200f77782f3', '44444444-dddd-4ddd-bddd-444444444444', 'Negative Price Bug', 'Invalid game for testing validation (price = -10)', -10, '2025-10-28 08:15:26', '2025-10-28 08:15:26'),
('42890c7d-b3d6-11f0-8787-3200f77782f3', '33333333-cccc-4ccc-bccc-333333333333', 'Expensive Collector Edition', 'Game to test upper price limits', 9999, '2025-10-28 08:15:26', '2025-10-28 08:15:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audiences`
--
ALTER TABLE `audiences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audience_id` (`audience_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`audience_id`) REFERENCES `audiences` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
