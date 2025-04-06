<?php
    session_start();
    //Controllo se ha tutte le varibili necessarie per accedere alla pagina altrimenti lo ridirigo al login
    if(!isset($_SESSION['username'])||
        !isset($_SESSION['id'])||
        !isset($_SESSION['email'])){
            header("Location: login.php");
            exit();
    }
    include "config.php";
    include "navbar.php";
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="img/favicon.png" sizes="32x32">
    <link rel="stylesheet" href="css/mainBoard.css">
    <link rel="stylesheet" href="css/navbar.css">
    <script src="js/mainBoard.js"></script>
    <title>Home</title>
</head>
<body>
    <?php
        //Includo la navbar
        $idButton="esci";
        $button="ESCI";
        navbar($idButton,$button);
    ?>
    <main>
        <div id="benvenuto">
            <h2>Benvenuto <?php 
            //Cerco l'utente nel DB e stampo il suo nome
            $victoriesSql = "SELECT * FROM users WHERE id = ? ";
            $victoriesStmt = $conn->prepare($victoriesSql);
            if (!$victoriesStmt) {
                error_log("Errore SQL: " . $conn->error);
            }    
            $victoriesStmt->bind_param("i", $_SESSION['id']);
            $victoriesStmt->execute();
            $victoriesResult = $victoriesStmt->get_result();
            $vittorie=false;
            if ($victoriesResult->num_rows > 0) {
                $row = $victoriesResult->fetch_assoc();
                echo $row['username'];
                $vittorie=$row['victories'];
            }
            ?></h2>
        </div>
        <div id="statistiche">
            <div>
                <h3>Statistiche</h3>
                <p>Vittorie: <?php
                        //Stampo le vittore dell'utente
                        if($vittorie){
                            echo $row['victories'];
                        } else{
                            echo '0';
                        }        
                        ?></p>
                <p>Partiegiocate: <?php
                    //Cerco il numero di partite a cui l'utente ha partecipato
                    $matchesSql = "SELECT * FROM matches WHERE (player1_id = ?  OR player2_id = ?) AND ended=true;";
                    $matchesStmt = $conn->prepare($matchesSql);
                    if (!$matchesStmt) {
                        error_log("Errore SQL: " . $conn->error);
                    }
                    $matchesStmt->bind_param("ii", $_SESSION['id'], $_SESSION['id']);
                    $matchesStmt->execute();
                    $matchesResult = $matchesStmt->get_result();
                    $numeroPartite=$matchesResult->num_rows;
                    //Stampo il numero di partite fatte
                    echo $numeroPartite."</p>";
                    //Calcolo la percentuale delle vittorie
                    if ($matchesResult->num_rows > 0) {
                        $percentualeVittorie=$vittorie*100/$numeroPartite;
                        echo "<p>percentuale di vittorie: ".number_format($percentualeVittorie, 2)."%</p>";
                    }    
                        ?>        
            </div>
            <div>
                <h3>Classifica globale</h3>
                <ol>
                    <?php
                        $scoreSql="SELECT users.username,users.victories FROM users ORDER BY users.victories DESC LIMIT 3;";
                        $scoreStmt = $conn->prepare($scoreSql);
                        if (!$scoreStmt) {
                            error_log("Errore SQL: " . $conn->error);
                        }
                        $scoreStmt->execute();
                        $scoreResult = $scoreStmt->get_result();
                        while($row = $scoreResult->fetch_assoc()){
                            echo "<li>";
                            echo $row["username"]." ".$row["victories"];
                            echo "</li>";
                        }
                    ?>
                </ol>
            </div>
        </div>
        <div id="partiteFatte">
            <h3>Partite fatte:</h3>
            <ul>
                <?php
                //Uso i rislutati della query che elenca le partite fatte dal utente anche per elencare effetivamente tutte le partite fatte
                    if ($matchesResult->num_rows > 0) {
                        while($row = $matchesResult->fetch_assoc()){
                            echo "<li>";
                            echo str_replace(","," ",$row["moves"]);
                            echo "</li>";
                        }
                    }else if($matchesResult->num_rows == 0){
                        echo "<li>";
                        echo "È il momento di fare la tua prima partita!!";
                        echo "</li>";
                    }
                    ?>
            </ul>
        </div>
        <div id="matchmaking">

            <p id="errori"></p>
            <button id="gioca">Gioca</button>
            <a href="documentazione.html" target="_blank" >Documentazione</a>
        </div>
    </main>
</body>
</html>