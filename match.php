<?php
    session_start();
    include "config.php";
?>
<!DOCTYPE html>
<html lang="it">    if()
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/chessboard.css">
    <script src="js/chessboard.js"></script>
    <title>Document</title>
</head>
<body>
    <div id="colore" data-colore="<?php if($_SESSION['piece']) echo "B"; else echo "N"?>"></div>
    <p>opponent: <?php
        $usrnmSql = "SELECT username FROM users WHERE id = ? ";
        $usrnmStmt = $conn->prepare($usrnmSql);
        if (!$usrnmStmt) {
            error_log("Errore SQL: " . $conn->error);
        }    
        $usrnmStmt->bind_param("i", $_SESSION['id']);
        $usrnmStmt->execute();
        $usrnmResult = $usrnmStmt->get_result();
        if ($usrnmResult->num_rows > 0) {
            $row = $usrnmResult->fetch_assoc();
            echo $row['username'];
        }
    ?></p>
    <table id="chessboard">
    </table>

</body>
</html>