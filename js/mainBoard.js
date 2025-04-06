let errori;
let button;
document.addEventListener("DOMContentLoaded", ()=>{
    errori=document.getElementById("errori");
    button=document.getElementById("gioca");
    
    //Imposta il tarto per iniziare la partita
    button.addEventListener("click", gioca);
    //Imposta il tasto esci
    document.getElementById("esci")
        .addEventListener("click", ()=>{
            window.location.href="login.php";
        });
})
//Funzione chiamata per fare il matchmaking
function gioca(e){
    button.disabled=true;
    mostraMessaggio("Matchmaking...")
    request();
}

function request(){
    //Faccio la richiesta al server per iniziare una partita
    fetch('matchmaking.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            //Partita disponibile
            mostraMessaggio("Partita Pronta!");
            //Fa il redirect della pagina
            window.location.href = data.redirect;
        }else{
            //Se la richietsa non è andata a buon fine aaspetto un secondo e la rifaccio
            setTimeout(request,1000);
        }
    })
    .catch(error => {
        //Se ci sono errori permetto all'utentse di ripreme il pulsante per fare altre richieste in futuro
        mostraMessaggio("Errore di connessione");
        button.disabled = false;
    });
}


function mostraMessaggio(messaggio){
    errori.innerText=messaggio;
}