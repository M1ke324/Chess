<?php
    session_start();
    if(!isset($_SESSION['username'])||
        !isset($_SESSION['id'])||
        !isset($_SESSION['email'])){
            header("Location: index.php");
            exit();
    }
    include "config.php";
?>
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
        $idButton="esci";
        $button="ESCI";
        include "navbar.php";
        navbar($idButton,$button);
    ?>
    <main>
        <div id="benvenuto">
            <h2>Benvenuto <?php 
            $victoriesSql = "SELECT * FROM users WHERE id = ? ";
            $victoriesStmt = $conn->prepare($victoriesSql);
            if (!$victoriesStmt) {
                error_log("Errore SQL: " . $conn->error);
            }    
            $victoriesStmt->bind_param("i", $_SESSION['id']);
            $victoriesStmt->execute();
            $victoriesResult = $victoriesStmt->get_result();
            if ($victoriesResult->num_rows > 0) {
                $row = $victoriesResult->fetch_assoc();
                echo $row['username'];
                $_SESSION['victories']=$row['victories'];
            }
            ?></h2>
        </div>
        <div>
            <h3>statistiche</h3>
            <p>Vittorie: <?php
                    if(isset($_SESSION['victories'])){
                        echo $row['victories'];
                    } else{
                        echo '0';
                    }        
                    ?></p>
            <p>Partiegiocate: <?php
                $matchesSql = "SELECT * FROM matches WHERE (player1_id = ?  OR player2_id = ?) AND ended=true;";
                $matchesStmt = $conn->prepare($matchesSql);
                if (!$matchesStmt) {
                    error_log("Errore SQL: " . $conn->error);
                }    
                $matchesStmt->bind_param("ii", $_SESSION['id'], $_SESSION['id']);
                $matchesStmt->execute();
                $matchesResult = $matchesStmt->get_result();
                $numeroPartite=$matchesResult->num_rows;
                echo $numeroPartite."</p>";
                if ($matchesResult->num_rows > 0) {
                    $percentualeVittorie=$_SESSION['victories']*100/$numeroPartite;
                    echo "<p>perchentuale di vittorie: ".$percentualeVittorie."%</p>";
                }    
                    ?>
        </div>
        <div id="partiteFatte">
            <h3>Partite fatte:</h3>
            <ul>
                <?php
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
        </div>
    </main>
</body>
</html>