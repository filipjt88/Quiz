<?php
$host     = 'localhost';
$dbname   = 'quiz_app';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4",$username, $password);
} catch(PDOException $e) {
    die("Greska u konekciji sa bazom podataka: " . $e->getMessage());
}
?>