
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
            this.init()
        })
    }

    init(){
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

        this.form.addEventListener("submit", this.submitLogin.bind(this));
        this.mostraRegistrati.addEventListener("click", this.nuovoForm.bind(this));
        this.regForm.addEventListener("submit", this.submitRegistrati.bind(this));

        this.boolReg=true;
    }

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
        if(this.password.value==""||this.username.value==""){
            this.mostraMessaggio("Tutti i campi devono essere riempiti")
            return;
        }
        if(this.username.checkValidity()&&this.password.checkValidity()){
            this.button.disabled = true;
            
            const form = new FormData();
            form.append('username', this.username.value);
            form.append('password', CryptoJS.SHA256(this.password.value));
            
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
                    this.mostraMessaggio(data.message);
                    this.button.disabled = false;
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                this.button.disabled = false;
            });
        }else{
            console.log("Dati non validi")
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

        if(this.usernameReg.value===""||
           this.passwordReg.value===""||
           this.emailReg.value===""||
           this.confermaPasswordReg===""){
            this.mostraMessaggioRegistrati("Tutti i campi devono essere riempiti");
            return;
        }
        if(this.passwordReg.value!=this.confermaPasswordReg.value){
            this.mostraMessaggioRegistrati("Le password devono coincidere");
            return;
        }

        if(this.usernameReg.checkValidity()&&
            this.emailReg.checkValidity()&&
            this.passwordReg.checkValidity()&&
            this.confermaPasswordReg.checkValidity()){
            
            this.registrati.disabled = true;
            
            const form = new FormData();
            form.append('username', this.usernameReg.value);
            form.append('email',this.emailReg.value);
            form.append('password', CryptoJS.SHA256(this.passwordReg.value).toString());
            
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
                    this.mostraMessaggioRegistrati(data.message);
                    this.registrati.disabled = false;
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                this.registrati.disabled = false;
            });
        }else{
            console.log("Dati non validi")
        }
    }
    
}

let login=new Login();


