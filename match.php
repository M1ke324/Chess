<?php
    session_start();
    include "config.php";

    if($_SERVER['REQUEST_METHOD']=="POST"){
        $inputJSON = file_get_contents('php://input');
        $data = json_decode($inputJSON, true);
        
        $matchSql = "SELECT * FROM matches WHERE match_id = ? ";
        $matchStmt = $conn->prepare($matchSql);
        if (!$matchStmt) {
            error_log("Errore SQL: " . $conn->error);
        }    
        $matchStmt->bind_param("i", $_SESSION['game']);
        $matchStmt->execute();
        $matchResult = $matchStmt->get_result();
        if ($matchResult->num_rows > 0) {
            $row = $matchResult->fetch_assoc();
            //Richiesta mossa avversario
            if(isset($data['request'])){
                if($row['round']==$data['player'])
                    echo $row['moves'];
                else
                    echo 'no';
                exit();
            }
            //Mossa fatta
            $round=!$row['round'];
            $row['moves']=$row['moves'].$data['partenza'].','.$data['pezzo'].','.$data['arrivo'].';';
            if(isset($data['vittoria'])&&$data['vittoria']){
                $winnerSql = "UPDATE  matches SET winner = ?, round = ?, moves = ?, ended = ? WHERE match_id = ? AND ended = FALSE" ;
                $winnerStmt = $conn->prepare($winnerStmt);
                if (!$winnerStmt) {
                    error_log("Errore SQL: " . $conn->error);
                }
                $winnerStmt->bind_param("iisii", $_SESSION['id'], $round, $row['moves'], true, $_SESSION['game']);
                if(!$winnerStmt->execute()){
                    error_log($conn->error);
                }

                $victoriesSql = "UPDATE users SET victories = victories + 1 WHERE match_id = ?";
                $victoriesStmt = $conn->prepare($victoriesSql);
                if (!$victoriesStmt) {
                    error_log("Errore SQL: " . $conn->error);
                }
                $victoriesStmt->bind_param("i", $_SESSION['id']);
                if(!$victoriesStmt->execute()){
                    error_log($conn->error);
                }
            }else{
                $updateSql="UPDATE matches SET round = ?, moves = ? WHERE match_id = ? AND ended = FALSE";
                $updateStmt = $conn->prepare($updateSql);
                if (!$updateStmt) {
                    error_log("Errore SQL: " . $conn->error);
                }
                $updateStmt->bind_param("isi",$round,$row['moves'],$_SESSION['game']);
                if(!$updateStmt->execute()){
                    error_log("Errore SQL: " . $conn->error);    
                }
            }
            echo "done";
            exit();
        }
    }
    ?>
<!DOCTYPE html>
<html lang="it">
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
        $usrnmStmt->bind_param("i", $_SESSION['opponent']);
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