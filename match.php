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
            header("Location: login.php");
            exit();
    }
    include "config.php";
    
    //Se è una richietsa POST la processo (è o una richiesta di mossa dellavversario, o la comunicazione di una mossa)
    if($_SERVER['REQUEST_METHOD']=="POST"){
        //Leggo il body della richiesta
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
                    //Se è il mio turno, l'avversario ha mosso, restituisco le mosse della partita
                    if($row['round']==$data['player']){
                        echo $row['moves'];
                        exit();
                    }
                    $counter++;
                    /*Se è ho controllato per più di 30 volte restituisco anche un fallimento, per evitare che rimangano loop nel server
                     *alla disonnessione del client
                    */
                    if($counter>30){
                        echo "no";
                        exit();
                    }
                    //Aspetto 2 secondi 
                    sleep(2);
                    //ricontrollo
                    continue;
                }
                //Mossa fatta
                //Cambio il round della partita
                $round=!$row['round'];
                //Aggiungo le nuove mosse alla lista delle mosse
                $row['moves']=$row['moves'].$data['partenza'].','.$data['pezzo'].','.$data['arrivo'].';';
                if(isset($data['vittoria'])){
                    //La partita è finita e c'è un vincitore, termino la partita nel DB
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
                    //Aumento il numero di vittorie del vincitore
                    $victoriesSql = "UPDATE users SET victories = victories + 1 WHERE id = ?";
                    $victoriesStmt = $conn->prepare($victoriesSql);
                    if (!$victoriesStmt) {
                        error_log("Errore SQL: " . $conn->error);
                    }
                    if($data['vittoria'])
                        $victoriesStmt->bind_param("i", $_SESSION['id']);
                    else
                        $victoriesStmt->bind_param("i", $_SESSION['opponent']);
                    if(!$victoriesStmt->execute()){
                        error_log($conn->error);
                    }
                }else{
                    //Non c'è ancora vincitore, flusso noramle di partita:
                    //Aggiorno le mosse e il round
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
                //comunico al client che le modifiche alla partita sono state eseguite e termino la richiesta
                echo "done";
                exit();
            }
            //while(true) per le richieste, controllo di uscita già esistente
        }while(isset($data['request']));
    }
    //Se non è una richiesta POST rispondo con il codice html della pagina
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
        //Aggiungo la navbar
        $idButton="abbandona";
        $button="ABBANDONA";
        navbar($idButton,$button);
        //Aggiungo una div, usata da javscript per capire di che squadra si è
        ?>
    <div id="colore" style="display: none;" data-colore="<?php if($_SESSION['piece']) echo "B"; else echo "N"?>"></div>
    <main>
        <div id="datiAvversario">
            <p id="avversario">Avversario: <?php
            //Stampo il nome dell'avversario
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
                //e il numero di partite giocate
                echo "<p>Vittorie: ".$row['victories'];
            }
            //Scacchiera creata lato client 
            ?>
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
            <a href="documentazione.html" target="_blank" >Documentazione</a>
        </div>
    </main>
</body>
</html>