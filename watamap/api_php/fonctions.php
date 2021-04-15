<?php
	/**
	 * autouploader de class / stacking class
	 */
	function chargerClasse($classe) {
		if(file_exists(ROOTS['class'].$classe.ROOTS['extphp'])){
			$file = ROOTS['class'].$classe . ROOTS['extphp'];
			require_once $file;
		} else {
			die('la classe ?');
		}
	}
	// ---------------------------------------------------------------------------	
	// DATES TEXTS & OTHER VALUES TOOLS ---------------------------------------------------------------
	function get_diffDate($debut,$fin){
		$dif = ceil(abs($fin - $debut) / 86400);
		return $dif;
	}
	function get_clean($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
	}
	function str_aireplace($source,$remplacementIdx){
		if (!empty($source) AND gettype($source) === 'string' AND !empty($remplacementIdx) AND is_array($remplacementIdx)){
			foreach($remplacementIdx as $name => $content){
				$source = str_replace($name, $content, $source);
			}
			return $source;
		}
		return false;
	}
	// LOG TOOLS -----------------------------------------------------------------
	/**
	 * clean print_r function
	 * @param $paquet array give me something to print like a string
	 * @param $title string give me something to print like a string or integer
	 */
	function print_air($paquet,$title='',$top=false,$hr=false){
		if (ROOTS['debug']){
				$hr = (!empty($hr)) ? "<hr>" : "";
				$br = (!empty($top)) ? PHP_EOL.PHP_EOL.PHP_EOL.PHP_EOL.PHP_EOL.PHP_EOL.PHP_EOL : "";
				if (!headers_sent()) {
					header('Content-type: text/html; charset=UTF-8');
				}
				print($hr.$br.'<pre>');
				// echo "function(".__FUNCTION__.")<br>";
				$title ? print($title.': ') : '';//print('print_r: ');
				print_r($paquet);
				print('</pre>');
		}
	}
	function print_airZ($tab = array(), $bloc = "",$tmp='', $strong = false, $niveau = 0) {
		$bloc = !empty($bloc) ? $bloc : '';
		if(is_object($tab)) {$tab = get_object_vars($tab);}	
		if($niveau != 0) {$bloc .= "<br/>";}	
		foreach($tab as $key => $value) {
			if($strong === true) {
					$bloc .= str_repeat("&nbsp;", $niveau * 4)."<strong>".$key."</strong> => ";
			} else {
				$bloc .= str_repeat("&nbsp;", $niveau * 4).$key." => ";
			}
			if(is_array($value) || is_object($value)) {
				$tmp = $key;
				$bloc = print_airZ($value, $bloc,$tmp, $strong, $niveau + 1);
				continue;
			}
			$bloc .= ($tmp === 'errors' ? '<span style="color:red">' : '') . $value. ($tmp === 'errors' ? '</span>' : '') . "<br/>";
		}
		return $bloc;
	}
	// FILES TOOLS --------------------------------------------------------------
	function requireonce($fileandpath){
		if (file_exists($fileandpath)){
			return require_once($fileandpath);
		}
	}
	function includeonce($fileandpath){
		if (file_exists($fileandpath)){
			include_once($fileandpath);
		}
	}
	function get_Ip(){
			if(!empty($_SERVER['HTTP_CLIENT_IP'])){
					//ip from share internet
					$ip = $_SERVER['HTTP_CLIENT_IP'];
			} elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
					//ip pass from proxy
					$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			} else{
					$ip = $_SERVER['REMOTE_ADDR'];
			}
		return $ip;
	}
