<?php
//Funzione per creare una navbar con l'immagine di una scacchiera e il titolo PAWN
//È possibile specificare l'id e il testo del pulsante con i parametri della funzione
function navbar($idButton,$button){
    echo '
    <nav>
        <img src="img/board.png" alt="chesboard icon">
        <h1 id="pawn">PAWN</h1>
        <button id='.$idButton.">".$button."</button>
    </nav>";
}?>