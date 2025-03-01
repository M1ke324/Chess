
let username;
let password;
let button;
let form;
let errori;



document.addEventListener("DOMContentLoaded", ()=>{
    username=document.getElementById("username");
    password=document.getElementById("password")
    button=document.getElementById("login");
    form=document.getElementById("form");
    errori=document.getElementById("errori");
    
    form.addEventListener("submit", submit)
})

function submit(e){
    e.preventDefault();
    if(username.checkValidity()&&username.checkValidity()){
        button.disabled = true;
        
        const form = new FormData();
        form.append('username', username.value);
        form.append('password', password.value);
        
        fetch('index.php', {
            method: 'POST',
            body: form,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                mostraMessaggio(data.message);
                button.disabled = false;
            }
        })
        .catch(error => {
            console.error('Errore:', error);
            button.disabled = false;
        });
    }else{
        console.log("Dati non validi")
    }
}

function mostraMessaggio(messaggio){
    errori.innerText=messaggio;
}