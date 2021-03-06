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
			'DBname' => "anotherone",
			'DBuser' => "root",
			'DBpass' => "",
			'DBcharset' => 'utf8mb4',
			'DBtabs' => ['pat_pages','pat_membres','pat_retards'],
			'getpos' => false,
		],
	];
	// CHOIX LECTURE BDD par défaut	$_sqlDatas[idBdd] et $_sqlDatas[idBdd]['DBtabs'][idTab]
	// private static $_choixBdd = [2,3];
	private static $_choixBdd = 2;
	private static $_postedDatas = false;
	private static $_methode = '';

	//EN TEST
	public static $_menuDashBoard = [
		"ClearCash" => [
			"content" => 'Logs',
			"title" => 'Activer/Désactiver les logs',
			"href" => false,
			"target" => false,
			"onclick" => "setLog();"
		],
		"Action_B" => [
			"content" => 'ClearCash',
			"title" => 'Effacer les données stockées en mémoire !',
			"href" => false,
			"target" => false,
			"onclick" => "unSetMePlease();"
		],
		"AddCube" => [
			"content" => 'AddCube',
			"title" => 'AddCube',
			"href" => false,
			"target" => false,
			"onclick" => "addCube();"
		]
	];
	public function __construct(){
		// print_air($_SESSION['token'],'token' );
		self::is_GETPOST();
	}
	// public static function get_ImportActive(){
	// 	return self::$_ImportActive;
	// }
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
			$besoins = "*";
			self::$_choixBdd = 0;
			self::$_sqlBind = ['client'=>1];
			self::$_sqlrequest = "SELECT ".$besoins." FROM wat_clients"
			." WHERE wat_clients.client_id = :client AND userStatus = 1";
			
		}
		elseif ($aaction==="getHtmlBoardDatas"){
			$besoins = "token";
			self::$_choixBdd = 0;
			$table = self::$_sqlDatas[self::$_choixBdd]['DBtabs'][2]; // <---- alway 2 for user table
			self::$_sqlBind = ['token'=>self::$_postedDatas->token];
			self::$_sqlrequest = "SELECT ".$besoins." FROM ".$table
			." WHERE ".$table.".token = :token";
		}
		elseif ($aaction==="startActionLoggin"){
			$besoins = "userip,userEmail,userStatus,lastconnect,x,y,z";
			self::$_choixBdd = 0;
			$table = self::$_sqlDatas[self::$_choixBdd]['DBtabs'][2]; // <---- alway 2 for user table
			self::$_sqlBind = ['email'=>self::$_postedDatas->login];
			self::$_sqlrequest = "SELECT ".$besoins." FROM ".$table
			." WHERE ".$table.".userEmail = :email AND ".$table.".userPass = '".md5(self::$_postedDatas->password)."'";
		}
		elseif ($aaction==="addGroupeToScene"){
			$besoins = "*";
			self::$_choixBdd = 0;
			self::$_sqlBind = ['level'=>self::$_postedDatas->level,'map'=>self::$_postedDatas->map];
			self::$_sqlrequest = "SELECT * FROM wat_items"
			." LEFT JOIN wat_clients ON wat_clients.client_id = wat_items.id_client"
			." LEFT JOIN wat_maps ON wat_maps.map_id = :map"
			." LEFT JOIN wat_levels ON wat_levels.level_id = :level";
		}
		elseif ($aaction==="getMapListeByClientId"){
			$besoins = "*";
			self::$_choixBdd = 0;
			self::$_sqlBind = ['client_id'=>self::$_postedDatas->client_id];
			self::$_sqlrequest = "SELECT ".$besoins." FROM wat_maps"
			." LEFT JOIN wat_clients ON wat_clients.client_id = wat_maps.id_client"
			." WHERE wat_clients.client_id = :client_id";
		}
		elseif ($aaction==="addComputersToScene"){
			$besoins = "*";
			self::$_choixBdd = 1;
			$table = self::$_sqlDatas[self::$_choixBdd]['DBtabs'][1]; // <---- alway 2 for user table
			// self::$_sqlBind = ['client_id'=>self::$_postedDatas->client_id];
			self::$_sqlrequest = "SELECT ".$besoins." FROM ".$table;
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

	private static function updateUserAccount($accountdatas=false){
		if(self::$_DbConnect && $accountdatas){
			try
			{
				$sql = "UPDATE wat_users SET token=?, lastconnect=?, userip=? WHERE userEmail=?";
				$stmt= self::$_DbConnect->prepare($sql);
				$stmt->execute([
					$_SESSION['Wtoken'],
					date('Y-m-d H:i:s'),
					get_Ip(),
					$accountdatas['userEmail']
					]
				);
			}
			catch(PDOException $e){
				return false;
			}
		}
	}
	// test de lecture d'une table
	private static function is_Import_Table(){
		if (self::$_ImportActive && self::$_postedDatas && self::$_sqlrequest){
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
				
				if ($allRows && count($allRows) > 0) {
					if(self::$_postedDatas){
						if(self::$_postedDatas->action==="startActionLoggin"){
							self::updateUserAccount($allRows[0]);
						}
						else if(self::$_postedDatas->action==="getHtmlBoardDatas"){
							$allRows[0]['htmlitems'] = self::$_menuDashBoard;
						}
						$allRows[0]['token'] = $_SESSION['Wtoken'];
						return [
							true,
							json_encode($allRows),
							$idBdd['getpos']
						];
					}
					return [
						false,
						json_encode(['erreur'=>'Post ','demande'=>"http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]",'post'=>$_POST['data']]),
						$idBdd['getpos']
					];
				}
				return [
					false,
					json_encode(['Reponse'=>'pas de datas ','demande'=>"http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]",'post'=>$_POST['data']]),
					$idBdd['getpos']
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
				case "42S22":
					$string = $server.' la colonne demande est absente (42522) !';
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
