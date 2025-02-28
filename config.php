<?php
$host = "127.0.0.1";
$user = "root";
$password = "pweb";
$db_name = "castrucci_636159";

$conn = mysqli_connect($host, $user, $password, $db_name,3306);

if (!$conn) {
    die("Connessione fallita: " . mysqli_connect_error());
}
?>