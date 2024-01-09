<?php

	class DbConnect {
		//CHANGE TO YOUR DATABASE INFORMATION.
		public $server = 'localhost';
		public $dbname = 'storedb';
		public $user = 'root';
		public $pass = '';
		public $port = '3306';
		function connect() {
			try {
				$conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname, $this->port);
				//echo "Connected successfully";
				return $conn;
			} catch (Exception $e) {
				die("Connection failed: " . $e->getMessage());
			}
		}
	}