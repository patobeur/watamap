<?php

class ImportDatabase {	
	private static $_DbConnect = false;		// partons du principe que la conection db est False
	private static $_ImportActive = true;	// active ou non la lecture par defaut
	// BDD
	private static $_sqlrequest = false;
	private static $_DBhost = '';
	private static $_DBname = '';
	private static $_DBcharset = '';
	private static $_DBuser = '';
	private static $_DBpass = '';
	private static $_clientId = 1;
	private static $_sqlBind = [];
	private static $_sqlmd5 = false;
	// TABLES
	private static $_sqlDatas = [
		0 => [
			'DBhost' => "127.0.0.1",
			'DBname' => "watamap",
			'DBuser' => "root",
			'DBpass' => "",
			'DBcharset' => 'utf8mb4',
			'DBtabs' => ['wat_items','wat_clients','wat_users'],
			'getpos' => true,
		],
		1 => [
			'DBhost' => "127.0.0.1",
			'DBname' => "glpi",
			'DBuser' => "root",
			'DBpass' => "",
			'DBcharset' => 'utf8mb4',
			'DBtabs' => ['glpi_computers','glpi_computertypes'],
			'getpos' => false,
		],
		2 => [
			'DBhost' => "127.0.0.1",
			'DBname' => "another",
			'DBuser' => "root",
			'DBpass' => "",
			'DBcharset' => 'utf8mb4',
			'DBtabs' => ['pat_pages','pat_membres','pat_utilisateurs','pat_retards'],
			'getpos' => true,
		],
	];
	// CHOIX LECTURE BDD par défaut	$_sqlDatas[idBdd] et $_sqlDatas[idBdd]['DBtabs'][idTab]
	// private static $_choixBdd = [2,3];
	private static $_choixBdd = 2;
	private static $_postedDatas = false;
	private static $_methode = '';

	public function __construct(){
		// print_air($_SESSION['token'],'token' );
		self::is_GETPOST();
	}
	public static function get_ImportActive(){
		return self::$_ImportActive;
	}
	public static function checkbddexiste($nDB,$nTD){
		if ($nDB >= 0 && $nDB < count(self::$_sqlDatas)) {
			if ($nTD >= 0 && $nTD < count(self::$_sqlDatas[$nDB]['DBtabs'])) {
				return self::$_ImportActive;
			}
		}
		return false;
	}
	
	public static function is_GETPOST(){
		if ( isset($_POST["data"])){
			self::$_postedDatas = json_decode($_POST["data"]);
			self::$_methode = 'POST';
		}
		else if ( isset($_GET) && isset($_GET['action']) && $_GET['action'] !="" ){
			self::$_postedDatas = $_GET;
			self::$_methode = 'GET';
		}
		else {
			return ['erreur methode'=>'erreur'];
		}


		// ACTIONS POSSIBLES
		$aaction = self::$_postedDatas->action;
		if ($aaction==="getConfig"){
			self::$_choixBdd = 0;
			self::$_sqlBind = ['client'=>1];
			self::$_sqlrequest = "SELECT * FROM wat_clients"
			." WHERE wat_clients.client_id = :client";
		}
		elseif ($aaction==="tryGetLogued"){
			self::$_choixBdd = 0;
			$table = self::$_sqlDatas[self::$_choixBdd]['DBtabs'][2]; // <---- alway 2 for user table
			self::$_sqlBind = ['email'=>self::$_postedDatas->login];
			self::$_sqlrequest = "SELECT * FROM ".$table
			." WHERE ".$table.".userEmail = :email AND ".$table.".userPass = '".md5(self::$_postedDatas->password)."'";
		}
		elseif ($aaction==="addGroupeToScene"){
			self::$_choixBdd = 0;
			self::$_sqlBind = ['level'=>self::$_postedDatas->level,'map'=>self::$_postedDatas->map];
			self::$_sqlrequest = "SELECT * FROM wat_items"
			." LEFT JOIN wat_clients ON wat_clients.client_id = wat_items.id_client"
			." LEFT JOIN wat_maps ON wat_maps.map_id = :map"
			." LEFT JOIN wat_levels ON wat_levels.level_id = :level";
		}
		elseif ($aaction==="getMapListeByClientId"){
			self::$_choixBdd = 0;
			self::$_sqlBind = ['client_id'=>self::$_postedDatas->client_id];
			self::$_sqlrequest = "SELECT * FROM wat_maps"
			." LEFT JOIN wat_clients ON wat_clients.client_id = wat_maps.id_client"
			." WHERE wat_clients.client_id = :client_id";
		}
		elseif ($aaction==="addComputersToScene"){
			self::$_choixBdd = 1;
			$table = self::$_sqlDatas[self::$_choixBdd]['DBtabs'][1]; // <---- alway 2 for user table
			// self::$_sqlBind = ['client_id'=>self::$_postedDatas->client_id];
			self::$_sqlrequest = "SELECT * FROM ".$table;
		}
	}
	public static function get_dataFromTable(){
		// est ce permis de se connecter ?
		if (self::$_ImportActive){
			// est ce vraiment possible de se connecter ?
			if (self::isDBConnect()){
				return self::is_Import_Table();
			};
		}
		
	}

	// test de connection a la bdd
	private static function isDBConnect(){
		$idBdd = self::$_sqlDatas[self::$_choixBdd];
		if ($idBdd['DBuser'] && $idBdd['DBuser'] != "") {
			try{
				self::$_DbConnect = new PDO("mysql:host=".$idBdd['DBhost'],$idBdd['DBuser'],$idBdd['DBpass']);
				return true; 
			}
			catch(PDOException $e){
				die(self::get_SqlErreurTexte($e,"La connexion Sql").'');
			}
		}
	}

	// test de lecture d'une table
	private static function is_Import_Table(){
		if (self::$_ImportActive && self::$_sqlrequest){
			$idBdd = self::$_sqlDatas[self::$_choixBdd];
			$table = $idBdd['DBtabs'][self::$_choixBdd];
			$xcount = 0;
			try{
				self::$_DbConnect = new PDO("mysql:".
					"host=".$idBdd['DBhost'].";".
					"dbname=".$idBdd['DBname'].";".
					"charset=".$idBdd['DBcharset'],
					$idBdd['DBuser'],
					$idBdd['DBpass']
				);
				$firstImp = self::$_DbConnect->prepare(self::$_sqlrequest);
				if (self::$_sqlBind){
					foreach(self::$_sqlBind as $key => $value) {
						$firstImp->bindParam($key, $value);
						$xcount++;
					}
				}
				$firstImp->execute();
				$allRows = $firstImp->fetchall(PDO::FETCH_ASSOC);
				// $allRows[] = ["token"=>"123456789-fernando-987654321"];
				if (count($allRows) > 0) {
					return [
						true,
						json_encode($allRows),
						$idBdd['getpos']
					];
				}
				return [
					false,
					json_encode(['erreur'=>'bdd vide ','demande'=>"http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]",'post'=>$_POST['data']]),
					false
				];
			}
			catch(PDOException $e){
				self::$_ImportActive = false;
			}
			return [false,self::get_SqlErreurTexte($e,"Importation ".$table).' Jetez un oeil dans le fichier definitions'];
		}
		return false;
	}
	private static function get_SqlErreurTexte($e,$server="BDD Import"){
		$string = "???";
		if ($e = $e->getCode()){
			switch ($e) {
				case "1045":
					$string = $server.' est refusée, droits insuffisants (28000) !';
				break;
				case "1049":
					$string = $server.' donne un nom de base inexistante (42000): Importation impossible !';
				break;
				case "2002":
					$string = $server.' ne répond pas à l\'adresse indiquée.';
				break;
				default:
					$string = $server.' donne une erreur :'.$e;
				break;
			}
		}
		return $string;
	}		
}
