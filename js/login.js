
class Login{
    username;
    password;
    button;
    form;
    errori;
    mostraRegistrati;
    registrati;
    regForm;
    boolReg;
    usernameReg;
    emailReg;
    passwordReg;
    confermaPasswordReg;
    registrati;
    erroriRegistrati;

    constructor(){
        document.addEventListener("DOMContentLoaded", ()=>{
            this.init();
        })
    }

    init(){
        //Assegno agli attributi della classe i rispettivi elementi
        this.username=document.getElementById("username");
        this.password=document.getElementById("password")
        this.button=document.getElementById("login");
        this.form=document.getElementById("form");
        this.errori=document.getElementById("errori");

        this.mostraRegistrati=document.getElementById("mostraRegistrati");
        this.registrati=document.getElementById("registrati");
        this.regForm=document.getElementById("regForm");

        this.usernameReg=document.getElementById("usernameReg");
        this.emailReg=document.getElementById("emailReg");
        this.passwordReg=document.getElementById("passwordReg");
        this.confermaPasswordReg=document.getElementById("confermaPasswordReg");
        this.registrati=document.getElementById("registrati");
        this.erroriRegistrati=document.getElementById("erroriRegistrati");

        //Assegno agli elementi gli eventListener
        this.form.addEventListener("submit", this.submitLogin.bind(this));
        this.mostraRegistrati.addEventListener("click", this.nuovoForm.bind(this));
        this.regForm.addEventListener("submit", this.submitRegistrati.bind(this));

        this.boolReg=true;
    }
    //Rimuovo il form di accesso e mostro quello di registrazione
    //o l'opposto a seconda di quello che è mostrato a schermo
    nuovoForm(e){
        if(this.boolReg){
            this.form.style.display="none";
            this.regForm.style.display="block";
            this.mostraRegistrati.innerText="Accedi";
        }else{
            this.form.style.display="block";
            this.regForm.style.display="none";
            this.mostraRegistrati.innerText="Registrati";
        }
        this.boolReg=!this.boolReg;
    }
    //submit login
    submitLogin(e){
        e.preventDefault();
        //Controllo che i campi non siano vuoti
        if(this.password.value==""||this.username.value==""){
            this.mostraMessaggio("Tutti i campi devono essere riempiti")
            return;
        }
        //Controllo che rispettino il formato corretto
        if(this.username.checkValidity()&&this.password.checkValidity()){
            this.button.disabled = true;
            //Creo il form da inviare
            const form = new FormData();
            form.append('username', this.username.value);
            form.append('password', this.password.value);
            
            fetch('login.php', {
                method: 'POST',
                body: form,
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    //Se il serverr lo permette faccio il redirect 
                    window.location.href = data.redirect;
                } else {
                    //Mostro l'errore indicato dal server
                    this.mostraMessaggio(data.message);
                    this.button.disabled = false;
                }
            })
            .catch(error => {
                //Se c'è un erroe nella connessione sblocco il pulsante per permette all'utente
                //di ritentare una richiesta più avanti
                this.mostraMessaggio("errore di connessione");
                this.button.disabled = false;
            });
        }
    }

    mostraMessaggio(messaggio){
        this.errori.innerText=messaggio;
    }

    mostraMessaggioRegistrati(messaggio){
        this.erroriRegistrati.innerText=messaggio;
    }

    submitRegistrati(e){
        e.preventDefault();
        //Controllo che i campi non siano vuoti
        if(this.usernameReg.value===""||
           this.passwordReg.value===""||
           this.emailReg.value===""||
           this.confermaPasswordReg===""){
            this.mostraMessaggioRegistrati("Tutti i campi devono essere riempiti");
            return;
        }
        //Controllo che le password siano uguali 
        if(this.passwordReg.value!=this.confermaPasswordReg.value){
            this.mostraMessaggioRegistrati("Le password devono coincidere");
            return;
        }
        //Controllo che rispettino il formato corretto
        if(this.usernameReg.checkValidity()&&
            this.emailReg.checkValidity()&&
            this.passwordReg.checkValidity()&&
            this.confermaPasswordReg.checkValidity()){
            
            this.registrati.disabled = true;
            
            //Creo il form da inviare
            const form = new FormData();
            form.append('username', this.usernameReg.value);
            form.append('email',this.emailReg.value);
            form.append('password', this.passwordReg.value);
            
            fetch('login.php', {
                method: 'POST',
                body: form,
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    //Se il serverr lo permette faccio il redirect 
                    window.location.href = data.redirect;
                } else {
                    //Mostro l'errore indicato dal server
                    this.mostraMessaggioRegistrati(data.message);
                    this.registrati.disabled = false;
                }
            })
            .catch(error => {
                //Se c'è un erroe nella connessione sblocco il pulsante per permette all'utente
                //di ritentare una richiesta più avanti
                this.mostraMessaggio("errore di connessione");
                this.registrati.disabled = false;
            });
        }
    }
    
}

let login=new Login();


