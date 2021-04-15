SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Base de données : `watamap`
--
CREATE TABLE `wat_clients` (
  `client_id` int(4) UNSIGNED NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `id_client` int(4) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wat_clients` (`client_id`, `client_name`, `id_client`) VALUES
(1, 'Mars', NULL),
(2, 'Lune', NULL);

CREATE TABLE `wat_items` (
  `item_id` int(4) UNSIGNED NOT NULL,
  `id_itemtype` int(4) UNSIGNED NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `id_parent` int(4) UNSIGNED DEFAULT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `z` float NOT NULL,
  `id_mat` int(4) UNSIGNED NOT NULL DEFAULT 1,
  `size_ratio` float NOT NULL DEFAULT 1,
  `id_client` int(4) UNSIGNED NOT NULL,
  `id_map` int(4) UNSIGNED NOT NULL,
  `id_level` int(4) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wat_items` (`item_id`, `id_itemtype`, `item_name`, `id_parent`, `x`, `y`, `z`, `id_mat`, `size_ratio`, `id_client`, `id_map`, `id_level`) VALUES
(1, 1, 'Mairie', 0, 0, 1, 1, 1, 1, 1, 1, 1),
(2, 1, 'Maison1', 0, 1, 3, 1, 2, 1, 1, 1, 1),
(3, 1, 'Maison2', 0, 2, 1, 1, 3, 1, 1, 1, 1),
(4, 2, 'Armoire bleue', 0, -5, 1, -10, 0, 1, 1, 1, 1),
(5, 2, 'Armoire jaune', 0, 5, 1, -5, 4, 1, 1, 1, 1);

CREATE TABLE `wat_itemtypes` (
  `itemtype_id` int(4) UNSIGNED NOT NULL,
  `itemtype_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wat_itemtypes` (`itemtype_id`, `itemtype_name`) VALUES
(1, 'batiment'),
(2, 'armoire');

CREATE TABLE `wat_levels` (
  `level_id` int(4) UNSIGNED NOT NULL,
  `id_parent` int(4) UNSIGNED DEFAULT NULL,
  `id_map` int(4) UNSIGNED NOT NULL,
  `level_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wat_levels` (`level_id`, `id_parent`, `id_map`, `level_name`) VALUES
(1, NULL, 1, 'Couche1');

CREATE TABLE `wat_maps` (
  `map_id` int(4) UNSIGNED NOT NULL,
  `id_parent` int(4) UNSIGNED DEFAULT NULL,
  `id_client` int(4) UNSIGNED NOT NULL,
  `map_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wat_maps` (`map_id`, `id_parent`, `id_client`, `map_name`) VALUES
(1, NULL, 1, 'Cassiopea'),
(2, NULL, 1, 'Sagitarius');

CREATE TABLE `wat_users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `userEmail` varchar(100) NOT NULL,
  `userPass` varchar(32) NOT NULL,
  `userStatus` int(1) NOT NULL DEFAULT 0,
  `userip` varchar(255) NOT NULL,
  `lastconnect` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `wat_users` (`user_id`, `userEmail`, `userPass`, `userStatus`, `userip`, `lastconnect`) VALUES
(1, 'patobeur41@gmail.com', 'f71dbe52628a3f83a77ab494817525c6', 1, '', '0000-00-00 00:00:00');

ALTER TABLE `wat_clients`
  ADD PRIMARY KEY (`client_id`);

ALTER TABLE `wat_items`
  ADD PRIMARY KEY (`item_id`);

ALTER TABLE `wat_itemtypes`
  ADD PRIMARY KEY (`itemtype_id`);

ALTER TABLE `wat_levels`
  ADD PRIMARY KEY (`level_id`);

ALTER TABLE `wat_maps`
  ADD PRIMARY KEY (`map_id`);

ALTER TABLE `wat_users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `wat_clients`
  MODIFY `client_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `wat_items`
  MODIFY `item_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `wat_itemtypes`
  MODIFY `itemtype_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `wat_levels`
  MODIFY `level_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `wat_maps`
  MODIFY `map_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `wat_users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;
