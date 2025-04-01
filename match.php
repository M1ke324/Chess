<?php
    session_start();
    //Controllo che l'utente abbia tutto ciò che serve per accedere
    if(!isset($_SESSION['username'])||
        !isset($_SESSION['id'])||
        !isset($_SESSION['email'])||
        !isset($_SESSION['piece'])||
        !isset($_SESSION['game'])||
        !isset($_SESSION['opponent'])
            ){
            header("Location: index.php");
            exit();
    }
    include "config.php";

    if($_SERVER['REQUEST_METHOD']=="POST"){
        $inputJSON = file_get_contents('php://input');
        $data = json_decode($inputJSON, true);
        $matchSql = "SELECT * FROM matches WHERE match_id = ? ";
        $counter=0;
        do{
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
                    if($row['round']==$data['player']){
                        echo $row['moves'];
                        exit();
                    }
                    $counter++;
                    if($counter>30){
                        echo "no";
                        exit();
                    }
                    sleep(2);
                    continue;
                }
                //Mossa fatta
                $round=!$row['round'];
                $row['moves']=$row['moves'].$data['partenza'].','.$data['pezzo'].','.$data['arrivo'].';';
                if(isset($data['vittoria'])){
                    $winnerSql = "UPDATE  matches SET winner = ?, round = ?, moves = ?, ended = ? WHERE match_id = ? AND ended = FALSE" ;
                    $winnerStmt = $conn->prepare($winnerSql);
                    if (!$winnerStmt) {
                        error_log("Errore SQL: " . $conn->error);
                    }
                    $vero=true;
                    if($data['vittoria'])
                        $winnerStmt->bind_param("iisii", $_SESSION['id'], $round, $row['moves'],$vero, $_SESSION['game']);
                    else
                        $winnerStmt->bind_param("iisii", $_SESSION['opponent'], $round, $row['moves'],$vero, $_SESSION['game']);
                    if(!$winnerStmt->execute()){
                        error_log($conn->error);
                    }
                    
                    $victoriesSql = "UPDATE users SET victories = victories + 1 WHERE id = ?";
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
        }while(isset($data['request']));
    }
    include "navbar.php";
    ?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="img/favicon.png" sizes="32x32">
    <link rel="stylesheet" href="css/chessboard.css">
    <link rel="stylesheet" href="css/match.css">
    <link rel="stylesheet" href="css/navbar.css">
    <script src="js/chessboard.js"></script>
    <title>Gioca!</title>
</head>
<body>
    <?php
        $idButton="abbandona";
        $button="ABBANDONA";
        navbar($idButton,$button);
        ?>
    <div id="colore" style="display: none;" data-colore="<?php if($_SESSION['piece']) echo "B"; else echo "N"?>"></div>
    <main>
        <div id="datiAvversario">
            <p id="avversario">Avversario: <?php
            $usrnmSql = "SELECT * FROM users WHERE id = ? ";
            $usrnmStmt = $conn->prepare($usrnmSql);
            if (!$usrnmStmt) {
                error_log("Errore SQL: " . $conn->error);
            }    
            $usrnmStmt->bind_param("i", $_SESSION['opponent']);
            $usrnmStmt->execute();
            $usrnmResult = $usrnmStmt->get_result();
            if ($usrnmResult->num_rows > 0) {
                $row = $usrnmResult->fetch_assoc();
                echo $row['username'].'</p>';
                echo "<p>Vittorie: ".$row['victories'];
            }?>
        </p>
        </div>
        <div id="tavola">
            <table id="chessboard">
            </table>
        </div>
        <div id="mosse">
            <h2>Mosse:</h2>
            <ol id="listaMosse">
            </ol>
        </div>
        <div id="risultato">
        </div>
    </main>
</body>
</html>