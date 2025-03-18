<?php
function navbar($idButton,$button){
    echo '
    <nav>
        <img src="img/board.png" alt="chesboard icon">
        <h1 id="pawn">PAWN</h1>
        <button id='.$idButton.">".$button."</button>
    </nav>";
}?>