-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 28, 2025 at 03:57 PM
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
-- Database: `ampm`
--
CREATE DATABASE IF NOT EXISTS `ampm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ampm`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
('1f2b7a8c-8d11-4d83-87a5-0c9e1a5e7a10', 'Dairy Products', '2025-10-28 15:53:12', '2025-10-28 15:53:12'),
('2e4d9f3b-1a25-46b2-8d20-7e78e7c5f2b2', 'Bakery', '2025-10-28 15:53:12', '2025-10-28 15:53:12'),
('3b6f8a9e-9c72-4a55-b67a-1a82e6d7a334', 'Snacks & Candy', '2025-10-28 15:53:12', '2025-10-28 15:53:12'),
('4c8e2b1a-7f93-4a60-905e-9f3e7b2d5c48', 'Vegetables', '2025-10-28 15:53:12', '2025-10-28 15:53:12'),
('5d7a9c3f-4b81-48c2-9f26-8d1a3e4f5b91', 'Beverages', '2025-10-28 15:53:12', '2025-10-28 15:53:12');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `manufacture_date` datetime NOT NULL,
  `expiration_date` datetime NOT NULL,
  `category_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` float NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `manufacture_date`, `expiration_date`, `category_id`, `price`, `created_at`, `updated_at`) VALUES
('cf1c4c62-b416-11f0-8e39-22925ccec7f6', 'Tnuva Milk 3%', '2025-10-20 00:00:00', '2025-11-03 00:00:00', '1f2b7a8c-8d11-4d83-87a5-0c9e1a5e7a10', 6.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5100-b416-11f0-8e39-22925ccec7f6', 'Danone Strawberry Yogurt', '2025-10-22 00:00:00', '2025-11-10 00:00:00', '1f2b7a8c-8d11-4d83-87a5-0c9e1a5e7a10', 4.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c520a-b416-11f0-8e39-22925ccec7f6', 'Cottage Cheese 5%', '2025-10-19 00:00:00', '2025-11-02 00:00:00', '1f2b7a8c-8d11-4d83-87a5-0c9e1a5e7a10', 7.2, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c526b-b416-11f0-8e39-22925ccec7f6', 'Emek Cheese 28%', '2025-10-18 00:00:00', '2025-12-01 00:00:00', '1f2b7a8c-8d11-4d83-87a5-0c9e1a5e7a10', 18.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c52ae-b416-11f0-8e39-22925ccec7f6', 'Tnuva Butter 200g', '2025-10-21 00:00:00', '2026-01-01 00:00:00', '1f2b7a8c-8d11-4d83-87a5-0c9e1a5e7a10', 9.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c52ed-b416-11f0-8e39-22925ccec7f6', 'White Bread Roll', '2025-10-25 00:00:00', '2025-10-28 00:00:00', '2e4d9f3b-1a25-46b2-8d20-7e78e7c5f2b2', 2.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5326-b416-11f0-8e39-22925ccec7f6', 'French Baguette', '2025-10-25 00:00:00', '2025-10-29 00:00:00', '2e4d9f3b-1a25-46b2-8d20-7e78e7c5f2b2', 5.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c541c-b416-11f0-8e39-22925ccec7f6', 'Butter Croissant', '2025-10-26 00:00:00', '2025-10-30 00:00:00', '2e4d9f3b-1a25-46b2-8d20-7e78e7c5f2b2', 7.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5469-b416-11f0-8e39-22925ccec7f6', 'Chocolate Cake Slice', '2025-10-24 00:00:00', '2025-11-04 00:00:00', '2e4d9f3b-1a25-46b2-8d20-7e78e7c5f2b2', 12, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c54a3-b416-11f0-8e39-22925ccec7f6', 'Whole Wheat Pita', '2025-10-25 00:00:00', '2025-10-30 00:00:00', '2e4d9f3b-1a25-46b2-8d20-7e78e7c5f2b2', 3.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c54d8-b416-11f0-8e39-22925ccec7f6', 'Elite Milk Chocolate', '2025-09-10 00:00:00', '2026-03-10 00:00:00', '3b6f8a9e-9c72-4a55-b67a-1a82e6d7a334', 5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c550f-b416-11f0-8e39-22925ccec7f6', 'Bazooka Gum', '2025-08-01 00:00:00', '2026-08-01 00:00:00', '3b6f8a9e-9c72-4a55-b67a-1a82e6d7a334', 1.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5546-b416-11f0-8e39-22925ccec7f6', 'Gummy Bears', '2025-09-15 00:00:00', '2026-02-15 00:00:00', '3b6f8a9e-9c72-4a55-b67a-1a82e6d7a334', 7.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c55b0-b416-11f0-8e39-22925ccec7f6', 'Bisli Grill Snack', '2025-09-20 00:00:00', '2026-03-20 00:00:00', '3b6f8a9e-9c72-4a55-b67a-1a82e6d7a334', 4.2, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c565b-b416-11f0-8e39-22925ccec7f6', 'Bamba Peanut Snack', '2025-09-22 00:00:00', '2026-03-22 00:00:00', '3b6f8a9e-9c72-4a55-b67a-1a82e6d7a334', 4.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c569e-b416-11f0-8e39-22925ccec7f6', 'Cherry Tomatoes', '2025-10-25 00:00:00', '2025-10-31 00:00:00', '4c8e2b1a-7f93-4a60-905e-9f3e7b2d5c48', 8.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c570d-b416-11f0-8e39-22925ccec7f6', 'Cucumbers', '2025-10-25 00:00:00', '2025-10-31 00:00:00', '4c8e2b1a-7f93-4a60-905e-9f3e7b2d5c48', 6.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5753-b416-11f0-8e39-22925ccec7f6', 'Fresh Carrots', '2025-10-24 00:00:00', '2025-10-30 00:00:00', '4c8e2b1a-7f93-4a60-905e-9f3e7b2d5c48', 5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c578a-b416-11f0-8e39-22925ccec7f6', 'Red Bell Pepper', '2025-10-25 00:00:00', '2025-11-02 00:00:00', '4c8e2b1a-7f93-4a60-905e-9f3e7b2d5c48', 7.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c57c2-b416-11f0-8e39-22925ccec7f6', 'Round Lettuce', '2025-10-25 00:00:00', '2025-10-29 00:00:00', '4c8e2b1a-7f93-4a60-905e-9f3e7b2d5c48', 6, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c57fa-b416-11f0-8e39-22925ccec7f6', 'Classic Cola 1.5L', '2025-08-10 00:00:00', '2026-08-10 00:00:00', '5d7a9c3f-4b81-48c2-9f26-8d1a3e4f5b91', 8, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5831-b416-11f0-8e39-22925ccec7f6', 'Sprite 1.5L', '2025-08-15 00:00:00', '2026-08-15 00:00:00', '5d7a9c3f-4b81-48c2-9f26-8d1a3e4f5b91', 7.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c5868-b416-11f0-8e39-22925ccec7f6', 'Neviot Mineral Water', '2025-10-10 00:00:00', '2026-10-10 00:00:00', '5d7a9c3f-4b81-48c2-9f26-8d1a3e4f5b91', 4, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c589e-b416-11f0-8e39-22925ccec7f6', 'Peach Iced Tea', '2025-09-05 00:00:00', '2026-09-05 00:00:00', '5d7a9c3f-4b81-48c2-9f26-8d1a3e4f5b91', 6.5, '2025-10-28 15:57:30', '2025-10-28 15:57:30'),
('cf1c58d3-b416-11f0-8e39-22925ccec7f6', 'Natural Orange Juice', '2025-10-20 00:00:00', '2025-12-20 00:00:00', '5d7a9c3f-4b81-48c2-9f26-8d1a3e4f5b91', 10.9, '2025-10-28 15:57:30', '2025-10-28 15:57:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
