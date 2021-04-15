<?php
	session_start();
	if (!isset($_SESSION['token'])){$_SESSION['token'] = '0123456789--fernando--9876543210';}
    // demarrage du chrono dans STARTT
	define('STARTT',$_SERVER['REQUEST_TIME_FLOAT']);

	// define variables
	require('config.php');
	// define variables
	require('fonctions.php');

	spl_autoload_register('chargerClasse');

    new importDatabase(); //! Mounting Database Class
	header('Content-Type: application/json');

	echo json_encode(importDatabase::get_dataFromTable());
?>