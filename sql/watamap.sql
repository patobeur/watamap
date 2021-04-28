-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 28 avr. 2021 à 12:13
-- Version du serveur :  10.4.17-MariaDB
-- Version de PHP : 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `watamap`
--

-- --------------------------------------------------------

--
-- Structure de la table `wat_clients`
--

CREATE TABLE `wat_clients` (
  `client_id` int(4) UNSIGNED NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `id_client` int(4) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `wat_clients`
--

INSERT INTO `wat_clients` (`client_id`, `client_name`, `id_client`) VALUES
(1, 'Mesland', 1),
(2, 'IMC', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `wat_items`
--

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

--
-- Déchargement des données de la table `wat_items`
--

INSERT INTO `wat_items` (`item_id`, `id_itemtype`, `item_name`, `id_parent`, `x`, `y`, `z`, `id_mat`, `size_ratio`, `id_client`, `id_map`, `id_level`) VALUES
(1, 1, 'Mairie', 0, 0, 1, 1, 1, 1, 1, 1, 1),
(2, 1, 'Maison1', 0, 1, 3, 1, 2, 1, 1, 1, 1),
(3, 1, 'Maison2', 0, 2, 1, 1, 3, 1, 1, 1, 1),
(4, 2, 'Armoire bleue', 0, -5, 1, -10, 0, 1, 1, 1, 1),
(5, 2, 'Armoire jaune', 0, 5, 1, -5, 4, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `wat_itemtypes`
--

CREATE TABLE `wat_itemtypes` (
  `itemtype_id` int(4) UNSIGNED NOT NULL,
  `itemtype_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `wat_itemtypes`
--

INSERT INTO `wat_itemtypes` (`itemtype_id`, `itemtype_name`) VALUES
(1, 'batiment'),
(2, 'armoire');

-- --------------------------------------------------------

--
-- Structure de la table `wat_levels`
--

CREATE TABLE `wat_levels` (
  `level_id` int(4) UNSIGNED NOT NULL,
  `id_parent` int(4) UNSIGNED DEFAULT NULL,
  `id_map` int(4) UNSIGNED NOT NULL,
  `level_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `wat_levels`
--

INSERT INTO `wat_levels` (`level_id`, `id_parent`, `id_map`, `level_name`) VALUES
(1, NULL, 1, 'Couche1');

-- --------------------------------------------------------

--
-- Structure de la table `wat_maps`
--

CREATE TABLE `wat_maps` (
  `map_id` int(4) UNSIGNED NOT NULL,
  `id_parent` int(4) UNSIGNED DEFAULT NULL,
  `id_client` int(4) UNSIGNED NOT NULL,
  `map_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `wat_maps`
--

INSERT INTO `wat_maps` (`map_id`, `id_parent`, `id_client`, `map_name`) VALUES
(1, NULL, 1, 'paris'),
(2, NULL, 1, 'mesland');

-- --------------------------------------------------------

--
-- Structure de la table `wat_users`
--

CREATE TABLE `wat_users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `userEmail` varchar(100) NOT NULL,
  `userPass` varchar(32) NOT NULL,
  `userStatus` int(1) NOT NULL DEFAULT 0,
  `userip` varchar(255) NOT NULL,
  `lastconnect` datetime NOT NULL DEFAULT current_timestamp(),
  `token` varchar(32) DEFAULT NULL,
  `x` int(3) NOT NULL,
  `y` int(3) NOT NULL,
  `z` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `wat_users`
--

INSERT INTO `wat_users` (`user_id`, `userEmail`, `userPass`, `userStatus`, `userip`, `lastconnect`, `token`, `x`, `y`, `z`) VALUES
(1, 'patobeur41@gmail.com', 'f71dbe52628a3f83a77ab494817525c6', 1, '127.0.0.1', '2021-04-28 12:12:46', '76fd889fece9827525c57559bb549ea5', 0, 0, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `wat_clients`
--
ALTER TABLE `wat_clients`
  ADD PRIMARY KEY (`client_id`);

--
-- Index pour la table `wat_items`
--
ALTER TABLE `wat_items`
  ADD PRIMARY KEY (`item_id`);

--
-- Index pour la table `wat_itemtypes`
--
ALTER TABLE `wat_itemtypes`
  ADD PRIMARY KEY (`itemtype_id`);

--
-- Index pour la table `wat_levels`
--
ALTER TABLE `wat_levels`
  ADD PRIMARY KEY (`level_id`);

--
-- Index pour la table `wat_maps`
--
ALTER TABLE `wat_maps`
  ADD PRIMARY KEY (`map_id`);

--
-- Index pour la table `wat_users`
--
ALTER TABLE `wat_users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `wat_clients`
--
ALTER TABLE `wat_clients`
  MODIFY `client_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `wat_items`
--
ALTER TABLE `wat_items`
  MODIFY `item_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `wat_itemtypes`
--
ALTER TABLE `wat_itemtypes`
  MODIFY `itemtype_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `wat_levels`
--
ALTER TABLE `wat_levels`
  MODIFY `level_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `wat_maps`
--
ALTER TABLE `wat_maps`
  MODIFY `map_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `wat_users`
--
ALTER TABLE `wat_users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
