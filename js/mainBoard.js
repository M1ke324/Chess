let errori;
let button;
document.addEventListener("DOMContentLoaded", ()=>{
    errori=document.getElementById("errori");
    button=document.getElementById("gioca");
    button.addEventListener("click", gioca);
})

let timeout;
function gioca(e){
    button.disabled=true;

    mostraMessaggio("Matchmaking...")
    timeout=setInterval(request,1000);
    request();

}

function request(){
    fetch('matchmaking.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        //DA ELIMINARE
        console.log(data)
        if(data.success){
            mostraMessaggio("Match ready!")
            clearInterval(timeout);
            window.location.href = data.redirect;
        }
    })
    .catch(error => {
        console.error('Errore:', error);
        button.disabled = false;
    });
    
}


function mostraMessaggio(messaggio){
    errori.innerText=messaggio;
}