<?php
    session_start();
    include "config.php";

    function fine($response){
        echo json_encode($response);
        exit();
    }

    function success($response,$bianco,$opponent,$game){
        $response['success']=true;
        $response['game']=$game;
        $response['piece']=$bianco;
        $response['redirect']="match.php";
        $_SESSION['piece']=$bianco;
        $_SESSION['game']=$game;
        $_SESSION['opponent']=$opponent;
        fine($response);
    }

    function gameEnded(){
        global $conn;
        global $response;
        $sql = "SELECT * FROM matches WHERE match_id = ?";
        $stmt = $conn->prepare($sql);
        error_log("Errore il controllo del game in attesa: " . $conn->error);
        $stmt->bind_param("i",$_SESSION['game']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            //Controllo se è arrivato un giocatore e la partita non è finita nel caso restituisco un successo
            //altrimenti avverto che la partita è finita e ne va cercata/creata un altra o che non è arrivato ancora nessuno e bisogna attendere
            if(!is_null($row['player2_id'])&&!$row['ended']){
                success($response,true,$row['player2_id'],$row['match_id']);
            }
            return $row['ended'];
        }else{
            return true;
        }
    }

    $response = [
        'success' => false,
        'game' => 0,
        'piece' => false //true-> white false->black
    ];
    //Se game non è settato cerco/creao una nuova, altrimenti guardo gameEnded()
    if(!isset($_SESSION['game'])||gameEnded()){
        //Se il giocatore non si era già messo in matchmaking, cerco altri giocatori pronti per un match    
        $sql = "SELECT * FROM matches WHERE player2_id IS NULL";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            //Aggiorno il database aggiungendo il nuovo giocatore per avvertire il primo che la partita è pronta
            $updatePlayer2Sql = "UPDATE matches SET player2_id = ? WHERE match_id = ?";
            $updatePlayer2Stmt = $conn->prepare($updatePlayer2Sql);
            $updatePlayer2Stmt->bind_param("ii", $_SESSION['id'], $row["match_id"]);

            if (!$updatePlayer2Stmt->execute()) {
                error_log("Errore durante l'aggiornamento di player2: " . $conn->error);
            }
            success($response,false,$row['player2_id'],$row['match_id']);
        } else {
            //Se non c'è nessun giocatore pronto a giocare all'ora mi metto in attesa di un giocatore
            $insertMatchSql = "INSERT INTO matches (player1_id) VALUES (?)";
            $insertMatchStmt = $conn->prepare($insertMatchSql);
            $insertMatchStmt->bind_param("i", $_SESSION['id']);
            
            if (!$insertMatchStmt->execute()) {
                error_log("Errore durante il matchmaking: " . $conn->error);
            }
            $checkPlayer1Sql = "SELECT * FROM matches WHERE player1_id = ? AND player2_id IS NULL";
            $checkPlayer1Stmt = $conn->prepare($checkPlayer1Sql);
            if (!$checkPlayer1Stmt) {
                error_log("Errore SQL: " . $conn->error);
            }    
            $checkPlayer1Stmt->bind_param("i", $_SESSION['id']);
            $checkPlayer1Stmt->execute();
            $player1Result = $checkPlayer1Stmt->get_result();
            if ($player1Result->num_rows > 0) {
                $row = $player1Result->fetch_assoc();
                $response['game']=$row['match_id'];
                $_SESSION['game']=$row['match_id'];
            }
        }
    }
    fine($response);
    
    //CHIUDERE LE CONNESSIONI?
?>