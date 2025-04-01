let errori;
let button;
document.addEventListener("DOMContentLoaded", ()=>{
    errori=document.getElementById("errori");
    button=document.getElementById("gioca");
    button.addEventListener("click", gioca);
    document.getElementById("esci")
        .addEventListener("click", ()=>{
            window.location.href="index.php";
        });
})

function gioca(e){
    button.disabled=true;

    mostraMessaggio("Matchmaking...")
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
            window.location.href = data.redirect;
        }else
            setTimeout(request,1000);
    })
    .catch(error => {
        console.error('Errore:', error);
        button.disabled = false;
    });
}


function mostraMessaggio(messaggio){
    errori.innerText=messaggio;
}