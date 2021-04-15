CREATE TABLE `glpi_computers` (
  `id` int(11) NOT NULL,
  `entities_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serial` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `otherserial` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact_num` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `users_id_tech` int(11) NOT NULL DEFAULT 0,
  `groups_id_tech` int(11) NOT NULL DEFAULT 0,
  `comment` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_mod` datetime DEFAULT NULL,
  `autoupdatesystems_id` int(11) NOT NULL DEFAULT 0,
  `locations_id` int(11) NOT NULL DEFAULT 0,
  `domains_id` int(11) NOT NULL DEFAULT 0,
  `networks_id` int(11) NOT NULL DEFAULT 0,
  `computermodels_id` int(11) NOT NULL DEFAULT 0,
  `computertypes_id` int(11) NOT NULL DEFAULT 0,
  `is_template` tinyint(1) NOT NULL DEFAULT 0,
  `template_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `manufacturers_id` int(11) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `is_dynamic` tinyint(1) NOT NULL DEFAULT 0,
  `users_id` int(11) NOT NULL DEFAULT 0,
  `groups_id` int(11) NOT NULL DEFAULT 0,
  `states_id` int(11) NOT NULL DEFAULT 0,
  `ticket_tco` decimal(20,4) DEFAULT 0.0000,
  `uuid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `is_recursive` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `glpi_computers` (`id`, `entities_id`, `name`, `serial`, `otherserial`, `contact`, `contact_num`, `users_id_tech`, `groups_id_tech`, `comment`, `date_mod`, `autoupdatesystems_id`, `locations_id`, `domains_id`, `networks_id`, `computermodels_id`, `computertypes_id`, `is_template`, `template_name`, `manufacturers_id`, `is_deleted`, `is_dynamic`, `users_id`, `groups_id`, `states_id`, `ticket_tco`, `uuid`, `date_creation`, `is_recursive`) VALUES
(1, 0, 'WAT-T900', 'AAAAAAA', 'No Asset Information', 'pat@WATAMAP', NULL, 0, 0, NULL, '2019-11-18 09:52:02', 0, 0, 1, 0, 1, 1, 0, NULL, 1, 0, 1, 6, 0, 1, '0.0000', 'AAAAAAAAAAAAAAA-BBBBBBBBBB-CCC-DDDD', '2019-07-17 11:46:48', 0),
(2, 0, 'WAT-2FuCC', 'CCCCCCC', '', '', '', 6, 0, 'Installation', '2019-07-19 15:42:57', 0, 4, 0, 2, 2, 2, 0, NULL, 55, 0, 0, 0, 0, 2, '0.0000', '', '2019-07-19 15:42:57', 0),
(3, 0, 'WAT-IS-RIGT', 'BBBBBBB', 'No Asset Tag', 'pat@WATAMAP', NULL, 0, 0, NULL, '2019-07-24 13:27:54', 0, 0, 1, 0, 3, 1, 0, NULL, 1, 0, 1, 6, 0, 1, '0.0000', 'AAAAAAAAAAAAAAA-BBBBBBBBBB-CCC-EEEE', '2019-07-24 13:00:04', 0);


ALTER TABLE `glpi_computers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date_mod` (`date_mod`),
  ADD KEY `name` (`name`),
  ADD KEY `is_template` (`is_template`),
  ADD KEY `autoupdatesystems_id` (`autoupdatesystems_id`),
  ADD KEY `domains_id` (`domains_id`),
  ADD KEY `entities_id` (`entities_id`),
  ADD KEY `manufacturers_id` (`manufacturers_id`),
  ADD KEY `groups_id` (`groups_id`),
  ADD KEY `users_id` (`users_id`),
  ADD KEY `locations_id` (`locations_id`),
  ADD KEY `computermodels_id` (`computermodels_id`),
  ADD KEY `networks_id` (`networks_id`),
  ADD KEY `states_id` (`states_id`),
  ADD KEY `users_id_tech` (`users_id_tech`),
  ADD KEY `computertypes_id` (`computertypes_id`),
  ADD KEY `is_deleted` (`is_deleted`),
  ADD KEY `groups_id_tech` (`groups_id_tech`),
  ADD KEY `is_dynamic` (`is_dynamic`),
  ADD KEY `serial` (`serial`),
  ADD KEY `otherserial` (`otherserial`),
  ADD KEY `uuid` (`uuid`),
  ADD KEY `date_creation` (`date_creation`),
  ADD KEY `is_recursive` (`is_recursive`);
  
ALTER TABLE `glpi_computers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;
