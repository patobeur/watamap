<?php
	session_start();
	
	// token temporaire
	if (!isset($_SESSION['WToken'])){$_SESSION['Wtoken'] = md5("WATOKEN".date('Y-m-d H:i:s'));}

    // demarrage du chrono dans STARTT
	define('STARTT',$_SERVER['REQUEST_TIME_FLOAT']);

	// set variables
	require('config.php');
	// set fonctions
	require('fonctions.php');

 	// Mounting Database Class
    new importDatabase();

	// json file header
	header('Content-Type: application/json');

	// display db response
	echo json_encode(importDatabase::get_dataFromTable());
?>