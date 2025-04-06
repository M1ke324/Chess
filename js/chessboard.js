let table;
const BIANCO="B";
const NERO="N";
const lettere=['a','b','c','d','e','f','g','h'];

document.addEventListener("DOMContentLoaded",()=>{
    //Scopro di che colore sono
    //il server lo mette in una div con attributo data-colore
    const colore=document.getElementById("colore");
    if(colore){
        if(colore.getAttribute("data-colore")=="N"){
            Chessboard.imBlack();
            //Faccio la richiesta di mosse dell'avversario
            Chessboard.checkMove();
        }else
            Chessboard.imWhite();
    }
    //Importo la scacchiera
    Chessboard.createChessboard();
    Chessboard.setUpChessboard();
    //Imposto gli attributi della classe
    Chessboard.listaMosse=document.getElementById("listaMosse");
    Chessboard.abbandona=document.getElementById("abbandona");
    //Se sono bianco è il mio turno e posso abbandonare altrimenti non posso
    Chessboard.abbandona.disabled=Chessboard.miaSquadra==NERO;
    //imposto l'attributo di resa
    Chessboard.resa=()=>{Chessboard.inviaMossa("","","",true)};
    Chessboard.abbandona.addEventListener("click",Chessboard.resa);
});

class Chessboard{
    //Massimo numero di righe
    static MAX_NUM=8;
    //Indica il pezzo cliccato
    static scelto;
    //booleano: indica se è il nostro turno
    static move;
    //Contiene l'event listener della resa, necessario al fine rimuoverlo a fine partita
    static resa;
    //Contiene l'elemento del tasto di abbandono
    static abbandona;
    //booleano: Segnala che si è fatto scacco all'avversario
    static scaccoAvversario;
    //booleano: Segnala che siamo sotto scacco
    static scacco;
    //booleano: Segnala che abbiamo fatto scacco matto all'avversario
    static scaccoMatto;
    //booleano: Server nel per segnalare alla funzione ce uno scacco quale varaibile settare in caso di scacco
    static provaDiScacco;
    //booleano: Settato quando alla mossa di un pezzo si rischia un autoscacco 
    static scaccoFasullo;
    //booleano: segnala la fine della partita
    static partitaFinita;
    //Memorizza la suadra NERO O BIANCO
    static miaSquadra;
    //Contiete l'elemento html della lista
    static listaMosse;

    //Imposta la partita per giocare con i bianchi
    static imWhite(){
        Chessboard.miaSquadra=BIANCO;
        Chessboard.move=true;
    }
    //Imposta la partita per giocare con i neri
    static imBlack(){
        Chessboard.miaSquadra=NERO;
        Chessboard.move=false;
    }
    // Attiva/disattiva la possibilita di muovere i pezzi
    static moveOpponent(){
        Chessboard.move=!Chessboard.move;
    }
    //Aggiunge la mossa alla liste della mosse fatte durante la partita
    static aggiungiMossa(squadra,numeroLetteraIniziale,pezzo,numeroLetteraFinale){
        let soggetto;
        if(squadra==Chessboard.miaSquadra)
            soggetto="Tu:";
        else
            soggetto="Avversario:";
        const elemento=document.createElement("li");
        elemento.innerText=soggetto+" "+numeroLetteraIniziale+" "+pezzo+" "+numeroLetteraFinale;
        this.listaMosse.appendChild(elemento);
    }
    //Con testo cambia il titolo della pagine, normalmente è PAWN
    //Con messaggio si manda un messaggio allutente in fondo alla pagina
    //Viene cambianto il tasto abbandona in ESCI
    static messaggio(testo,spiegazione,){
        testo=String(testo);
        spiegazione=String(spiegazione);
        //Cambiamento del titolo
        const pawn=document.getElementById("pawn");
        pawn.innerText=testo;
        pawn.style.color="#AF1B3F";
        //Messaggio all'utente
        document.getElementById("risultato").innerText=spiegazione;
        //Cambiamento del tasto abbandona
        Chessboard.abbandona.innerText="ESCI";
        Chessboard.abbandona.style.backgroundColor="#AF1B3F";
        Chessboard.abbandona.disabled=false;
        Chessboard.abbandona.removeEventListener("click", Chessboard.resa);
        Chessboard.abbandona.addEventListener("click",()=>{
            window.location.href="index.php";
        });
    }
    //Crea la scacchiera
    static createChessboard(){
        table=document.getElementById("chessboard");
        //Lettera a titolo della colonna
        const thead=document.createElement("thead");
        const trh=document.createElement("tr");
        const th1=document.createElement("th");
        thead.appendChild(trh);
        trh.appendChild(th1)
        for(let lettera of lettere){
            const th=document.createElement("th");
            trh.appendChild(th);
            th.textContent=String(lettera).toUpperCase();
        }
        table.appendChild(thead);
        let num=0;
        for(let numero=Chessboard.MAX_NUM;numero>=1;numero--){
            //Se siamo neri la scacchiera viene creata sottosopra
            if(Chessboard.miaSquadra==NERO)
                num=Chessboard.MAX_NUM-numero+1;
            else
                num=numero
            const tr=document.createElement("tr");
            table.appendChild(tr);
            //Prima colonna con numero della riga
            tr.id=num;
            const td=document.createElement("td");
            td.textContent=String(num);
            tr.appendChild(td);
            //Scacchiera vera e propria
            for(let lettera of lettere){
                const td=document.createElement("td");
                //id del td
                td.id=lettera+String(num);
                tr.appendChild(td);
            }
        }

    }
    
    //posiziona un pezzo per la prima volta
    //Lo va a cercare nella cartella /img/pezzi/
    static posizionaPezzo(pezzo,lettera,numero,squadra,classe=null){
        lettera=String(lettera).toLowerCase();
        const posto=document.getElementById(lettera+String(numero));
        posto.classList.add(squadra);
        const img=document.createElement("img");
        img.src=`img/pezzi/${pezzo+squadra}.png`;
        img.id=pezzo+","+squadra+","+lettera+","+numero;
        img.alt=pezzo+" "+squadra;
        img.onclick=Chessboard.clickPezzo;
        //Se specificato aggiunge una classe all'immagine del pezzo
        if(classe)
            img.classList.add(classe);
        posto.appendChild(img);
    }

    static setUpChessboard(){
        //Posizionamento dei pedoni
        for(let lettera of lettere){
            Chessboard.posizionaPezzo("pedone",lettera,2,BIANCO);
            Chessboard.posizionaPezzo("pedone",lettera,7,NERO);
        }

        //posizionamento torri
        Chessboard.posizionaPezzo("torre","a",1,BIANCO);
        Chessboard.posizionaPezzo("torre","h",1,BIANCO);
        Chessboard.posizionaPezzo("torre","a",8,NERO);
        Chessboard.posizionaPezzo("torre","h",8,NERO);

        //posizionamento alfieri;
        Chessboard.posizionaPezzo("alfiere","c",1,BIANCO);
        Chessboard.posizionaPezzo("alfiere","f",1,BIANCO);
        Chessboard.posizionaPezzo("alfiere","c",8,NERO);
        Chessboard.posizionaPezzo("alfiere","f",8,NERO);

        //posizionamento cavalli
        Chessboard.posizionaPezzo("cavallo","b",1,BIANCO);
        Chessboard.posizionaPezzo("cavallo","g",1,BIANCO);
        Chessboard.posizionaPezzo("cavallo","b",8,NERO);
        Chessboard.posizionaPezzo("cavallo","g",8,NERO);

        //posizionamento re
        //Al re viene aggiunta la classe re+squadra per semplificare la ricerca del re 
        Chessboard.posizionaPezzo("re","d",1,BIANCO,"re"+BIANCO);
        Chessboard.posizionaPezzo("re","d",8,NERO,"re"+NERO);
                
        //posizionamento regina
        Chessboard.posizionaPezzo("regina","e",1,BIANCO);
        Chessboard.posizionaPezzo("regina","e",8,NERO);

    }
    //Rimuove la classe da tutti gli elementi che la posseggono
    //permette anche di fare dellezioni a quegli elementi prima che venga rimosssa
    static rimuoviClasse(classe,daFare=false){
        const evidenziate=document.getElementsByClassName(classe);
        while(0<evidenziate.length){
            if(daFare){
                daFare(evidenziate[0]);
            }
            evidenziate[0].classList.remove(classe);"evidenziata"
        }
    }
    //Viene chiamatta alla selezione di un nuovo pezzo per togliere le classi aggiunte precedentemente
    static rimuoviEvidenziate(){
        Chessboard.rimuoviClasse("evidenziata",(casella)=>{if(casella){casella.onclick=null;}})
        Chessboard.rimuoviClasse("avversario",(casella)=>{if(casella){casella.onclick=null;casella.firstChild.onclick=Chessboard.clickPezzo;}})
        Chessboard.rimuoviClasse("pericolo");
        Chessboard.rimuoviClasse("click");
        //Se c'era la possibilita dell'auto scacco resetta la varibile (adesso abbiamo clieccato un pezzo potenzialmente diverso)
        //e rimuove le caselle di scacco
        if(Chessboard.scaccoFasullo){
            Chessboard.scaccoFasullo=false;
            Chessboard.rimuoviClasse("scacco");
        }
    }
    //Restituisce la squadra opposta a quella passata
    static opposto(squadra){
        if(squadra==BIANCO)
            return NERO;
        else
            return BIANCO;
    }
    //Sposta un pezzo, può esseere un evento o chiamata da altre funzioni
    //Si aspetta di trovar il pezzo da spostare in e.target come lemento html
    static sposta(e){
        const casella=e.target;
        //Prende le informazioni del pezzo selezionato
        let [pezzo,squadra,lettera,numero]= Chessboard.scelto.id.split(",");
        //entro se il pezzo è mio o se non mi posso muovere (è l'avversario a muovere)
        //Escludo la possibilità di muovere pezzi avversari nel mio turno
        //La possibilità di muovere pezzi fuori dal mio turno è esclusa da Evidenzia
        if(!Chessboard.move||Chessboard.miaSquadra==squadra){
            //Sposto la classe del td, e il pezzo degli scacchi
            Chessboard.scelto.parentElement.classList.remove(squadra);
            Chessboard.scelto.parentElement.removeChild(Chessboard.scelto);
            casella.appendChild(Chessboard.scelto);
            casella.classList.add(squadra);
            Chessboard.scelto.id=pezzo+","+squadra+","+casella.id.charAt(0)+","+casella.id.charAt(1);
            Chessboard.rimuoviEvidenziate();
            //Se sono io a muovere
            if(Chessboard.move){
                //lettera e numero in cui il pezzo è stato spostato
                let [letteraNuova,numeroNuovo]= [casella.id.charAt(0),casella.id.charAt(1)];
                //Se è mia invio la mossa
                //Se ero sotto scacco mi ci sono tolto
                if(Chessboard.scacco){
                    Chessboard.scacco=false;
                    Chessboard.rimuoviClasse("scacco");
                }
                //Controllo se ho fatto scacco all'avversario
                Chessboard.controlloScacco(pezzo,letteraNuova,numeroNuovo,squadra);
                //Nel caso controllo se è mattto
                if(Chessboard.scaccoAvversario){
                    Chessboard.controlloScaccoMatto(pezzo,letteraNuova,numeroNuovo);
                }
                Chessboard.inviaMossa(lettera+numero,pezzo,casella.id);
            }
        }
    }
    // Classe per mangiare un pezzo avversario
    //si aspetta il pezzo avversaria da mangiare come elemento in elemento html in e.target
    static mangia(e){
        const pezzoAvversario=e.target;
        //Finge un evento per la funzione sposta
        const evento={};
        evento.target=pezzoAvversario.parentElement;
        let [,squadra,,]=pezzoAvversario.id.split(",");
        //controlla che si mangi un pezzo dell'avversario o che sia l'avversario a muovere
        if(!Chessboard.move||squadra==Chessboard.opposto(Chessboard.miaSquadra)){
            //Rimuove il pezzo mangiato
            pezzoAvversario.parentElement.classList.remove(squadra);
            pezzoAvversario.parentElement.removeChild(pezzoAvversario);
            //Sposta il pezzo che mangia
            Chessboard.sposta(evento);
        }
    }

    //Evidenzia una casella per indicarla come possibile per uno spostamento o per mangiare
    //Questa funzione è cihiama spesso in cicli while, ritorna false quando vuole avvisare la funzione chiamante di non continuare in quella direzione
    //Opzioni utili (sopratuttto per il pedone le prime due):
    //Non mangiare: permette di specificare se si vuole evitare di mangiare pezzi avversari e muoversi e basta
    //Non spostarti: serve ad indicare caselle dove si può arrivare solo mangiando
    //re serve a segnalare che deve evidenziare le mosse di un re, e a vietare le mosse che meterebbero in pericolo il re facendo autoscacco
    static evidenzia(lettera, numero,squadra,nonMangiare=false,nonSpostarti=false,re=false){
        try {
            const casella=document.getElementById(lettera+String(numero))

            //Se sono un re e la casella è pericolosa non mi posso spostare, neanche per mangiare
            if(re&&casella.classList.contains("pericolo")){
                return false;
            }

            // Se scaccoFasullo è settato vuol dire che se muovo il pezzo in un pezzo non di scacco, si ha un autoscacco, quindi lo proibisco sotto
            if(Chessboard.scaccoFasullo&&!casella.classList.contains("scacco")){
                //ritorno false perchè mi devo mantenere sulla traiettoria di scacco per non fare autoscacco
                return false;
            }
            //Contiene pedina avversaria
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                if(!nonMangiare){
                    casella.classList.add("avversario");
                    //Se è il mio turno aggiungo l'evento e la classe click(se è la mia squadra)
                    if(Chessboard.move){
                        if(squadra==Chessboard.miaSquadra)
                            casella.classList.add("click");
                        casella.firstChild.onclick=Chessboard.mangia;
                    }
                }
                return false;
            }
            //non evidenzia se c'è un pezzo della nostra squadra
            if(casella.classList.contains(squadra)){
                return false;
            }

            /* Se non sono un re 
            *  sono sotto scacco     
            *  se la casella non è segnata come scacco
            *  in quel caso non mi ci posso spostare (posso spotarmi solo nei posti che evitano lo scacco)
            */
            if(!re&&Chessboard.scacco&&squadra==Chessboard.miaSquadra&&!casella.classList.contains("scacco")){
                //Ritorno true, perchè in quella direzione ci possono essere comunque caselle di scacco
                return true;
            }
            //se non Spostarti è settato non si sposta
            if(nonSpostarti)
                return false; 
            //Evidenzia il posto come possibile per il movimento
            casella.classList.add("evidenziata");
            if(Chessboard.move){
                //se è il mio turno
                if(squadra==Chessboard.miaSquadra)
                    casella.classList.add("click");
                casella.onclick=Chessboard.sposta;
            }
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }
    //Chiama l'argomento funzione sui posti in cui si può spostare l'alfiere
    static evidenziaAlfiere(lettera,numero,squadra,funzione){
        let modificaLetteraA=lettera.charCodeAt(0);
        let modificaNumeroA=numero;
        while(funzione(String.fromCharCode(++modificaLetteraA),++modificaNumeroA,squadra));
        modificaLetteraA=lettera.charCodeAt(0);
        modificaNumeroA=numero;
        while(funzione(String.fromCharCode(--modificaLetteraA),--modificaNumeroA,squadra));
        modificaLetteraA=lettera.charCodeAt(0);
        modificaNumeroA=numero;
        while(funzione(String.fromCharCode(--modificaLetteraA),++modificaNumeroA,squadra));
        modificaLetteraA=lettera.charCodeAt(0);
        modificaNumeroA=numero;
        while(funzione(String.fromCharCode(++modificaLetteraA),--modificaNumeroA,squadra));
    }
    //Chiama l'argomento funzione sui posti in cui si può spostare la torre
    static evidenziaTorre(lettera,numero,squadra,funzione){
        let modificaLetteraT=lettera.charCodeAt(0);
        let modificaNumeroT=numero;
        while(funzione(String.fromCharCode(modificaLetteraT),++modificaNumeroT,squadra));
        modificaNumeroT=numero;
        while(funzione(String.fromCharCode(modificaLetteraT),--modificaNumeroT,squadra));
        modificaNumeroT=numero;
        while(funzione(String.fromCharCode(--modificaLetteraT),modificaNumeroT,squadra));
        modificaLetteraT=lettera.charCodeAt(0);
        while(funzione(String.fromCharCode(++modificaLetteraT),modificaNumeroT,squadra));
    }

    //Chiama l'argomento funzione sulle possibili mosse del pedone 
    //NonSportarti permette di selezionare solo le caselle in cui può mangiare ed evitare quelle in cui si sposta
    static evidenziaPedone(lettera,numero,squadra,funzione,nonSpostarti=false){
        let modificaLetteraP=lettera.charCodeAt(0);

        if(squadra==BIANCO&&numero<Chessboard.MAX_NUM){
            if(!nonSpostarti){
                //Se è in posizione di partenza si può muovere di 2
                if(funzione(lettera,numero+1,squadra,true,false))
                    if(numero===2)
                        funzione(lettera,numero+2,squadra,true,false);
            }
            //Posti in cui mangia ma non si sposta noramlmente
            funzione(String.fromCharCode(modificaLetteraP+1),numero+1,squadra,false,true);
            funzione(String.fromCharCode(modificaLetteraP-1),numero+1,squadra,false,true);
        }
        //uguale a sopra ma i pedoni neri si muovo in negativo rispetto ai numeri, e hanno controlli speculari
        if(squadra==NERO&&numero>2){
            if(!nonSpostarti){
                if(funzione(lettera,numero-1,squadra,true,false))
                    if(numero===7)
                        funzione(lettera,numero-2,squadra,true,false);
            }
            funzione(String.fromCharCode(modificaLetteraP+1),numero-1,squadra,false,true);
            funzione(String.fromCharCode(modificaLetteraP-1),numero-1,squadra,false,true);
        }
    }
    //Chiama l'argomento funzione sulle 8 caselle adiacenti al re
    //Prima di spostarsi chiama geraPostiPericolosi per evitare di fare autoscacco
    //Se si vuole evitare la generazione dei posti poricolosi settare l'argomento:"evitaRicorsione"
    static evidenziaRe(lettera,numero,squadra,funzione,evitaRicorsione=false){
        let casellaRe;
        //evita ricorsione è attivata quando evidenziaRe è chiamata da genera posti pericolosi ed evita che si crei un loop
        //viene rimossa la classe dalla td per fare in modo che quando viene chiamato normalmente per la pressione dell'utente(non nella generazione di posti pericolosi)
        //i posti pericolosi vengano generati attraversando il re, per evitare che il re si rimetta in un posto pericoloso
        if(!evitaRicorsione){
            casellaRe=document.getElementById(lettera+String(numero));
            casellaRe.classList.remove(squadra);
            Chessboard.generaPostiPericolosi();
        }
        for(let i=-1;i<=1;i++)
            for(let c=-1;c<=1;c++)
                if(c!=0||i!=0)
                    funzione(String.fromCharCode(lettera.charCodeAt(0)+i),numero+c,squadra,false,false,true);
        if(!evitaRicorsione){
            casellaRe.classList.add(squadra);
        }
    }

    //Chiama l'argomento funzione sulle caselle in cui il cavallo può spostarsi/mangiare
    static evidenziaCavallo(lettera,numero,squadra,funzione){
        funzione(String.fromCharCode(lettera.charCodeAt(0)+1),numero+2,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)-1),numero+2,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)+1),numero-2,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)-1),numero-2,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)+2),numero+1,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)-2),numero+1,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)+2),numero-1,squadra);
        funzione(String.fromCharCode(lettera.charCodeAt(0)-2),numero-1,squadra);
    }
    //Chiama l'argomento funzione sulle caselle in cui la regina può spostarsi/mangiare
    //È l'unione delle mosse dell'alfiere e della torre
    static evidenziaRegina(lettera,numero,squadra,funzione){
        Chessboard.evidenziaAlfiere(lettera,numero,squadra,funzione);
        Chessboard.evidenziaTorre(lettera,numero,squadra,funzione);
    }

    //Chiamata al click di un pezzo
    static clickPezzo(e){
        const target=e.target;
        let [pezzo,squadra,lettera,numero]=target.id.split(",");
        
        //Rimuove le possibili mosse del pezzo premuto in precedenza
        Chessboard.rimuoviEvidenziate();
        //Salva l'ultimo pezzo clickato
        Chessboard.scelto=target;
        //Se è il mio turno, è un mio pezzo, e non sono sotto scacco, controllo se muovendo il pezzo posso fare autoscacco
        if(Chessboard.miaSquadra==squadra&&Chessboard.move&&!Chessboard.scacco)
            Chessboard.controlloAutoScacco(e.target);
        Chessboard.selettoreDiMosse(pezzo,lettera,numero,squadra);
    }
    //Permette di ciamare la funzione giusta per il pezzo
    //Rende possibile eseguire su ogni casella in cui può muoversi un pezzo una funzione,funzione di default: evidenzia
    //evitaRicorsione: settata da generaPostiPericolosi, per evitare loop sul re
    //Non spostare pedone: permette di specificare se il pedone deve solo mangiare o può anche spostarsi
    static selettoreDiMosse(pezzo,lettera,numero,squadra,funzione=Chessboard.evidenzia,nonSpostarePedone=false,evitaRicorsione=false){
        numero=Number(numero);
        switch (pezzo) {
            case "pedone":
                Chessboard.evidenziaPedone(lettera,numero,squadra,funzione,nonSpostarePedone);
                break;
            case "cavallo":
                Chessboard.evidenziaCavallo(lettera,numero,squadra,funzione);
                break;
            case "alfiere":
                Chessboard.evidenziaAlfiere(lettera,numero,squadra,funzione);
                break;
            case "torre":
                Chessboard.evidenziaTorre(lettera,numero,squadra,funzione);
                break;
            case "regina":
                Chessboard.evidenziaRegina(lettera,numero,squadra,funzione);
                break;
            case "re":
                Chessboard.evidenziaRe(lettera,numero,squadra,funzione,evitaRicorsione);
               break;
        }
    }

    //Invia al server una mossa fatta
    static inviaMossa(partenza,pezzo,arrivo,resa=false){
        let invio={};
        invio.partenza=partenza;
        invio.pezzo=pezzo;
        let aggiunta="";
        //Gestisce la resa
        if(resa){
            Chessboard.messaggio("RESA","Ti sei arreso")
            Chessboard.partitaFinita=true;
            //dice al server che la vittoria è avversaria
            invio.vittoria=false;
            aggiunta="Resa";
            //Gestisce lo scacco matto
        }else if(Chessboard.scaccoMatto){
            invio.vittoria=true;
            Chessboard.messaggio("VITTORIA","Complimenti!")
            aggiunta="#";
            }else {
                //Disattiva la possibilità di abbandono
                Chessboard.abbandona.disabled=true;
                //Avvisa l'avversario dello scacco
                if(Chessboard.scaccoAvversario)
                    aggiunta="+";
            }
        invio.arrivo=arrivo+aggiunta;
        Chessboard.aggiungiMossa(Chessboard.miaSquadra,partenza,pezzo,invio.arrivo);
        //Resetta lo scacco Avversario(non essendo matto l'avversario avrà risolto lo scacco)
        Chessboard.scaccoAvversario=false;
        //Invia i dati al server sottoforma di JSON
        fetch('match.php', {
            method: 'POST',
            body: JSON.stringify(invio),
            credentials: 'same-origin'
        })
        .then(response => response.text())
        .then(data => {
            if(data==="done")
                //Se è andato tutto bene
                Chessboard.moveOpponent();
                //Ammeno che la prtita non sia finita richiedo al server la mossa dell'avversario
                if(!Chessboard.partitaFinita)
                    Chessboard.checkMove();
            })
            .catch(error => {
                Chessboard.messaggio("OPS","Errore di connessione")
            });
    }
    //Muove un pezzo da start ad end
    //Se in end c'è un pezzo lo mangia
    //Chiamata quando l'avversario muove un pezzo
    static movePiece(start,end){
        const startingSquare=document.getElementById(start);
        const endingSquare=document.getElementById(end);
        //Segnala all'utente il pezzo mosso dall'avversario
        endingSquare.style.backgroundColor="#D38B5D";
        setTimeout(()=>{
            endingSquare.style.backgroundColor="";
        },3000);
        //Lo muove solo se effettivamente c'è un pezzo
        if(startingSquare.firstChild){
            Chessboard.scelto=startingSquare.firstChild;
            //Simuola un evento per mangia o sposta
            const evento={};
            if(endingSquare.firstChild){
                evento.target=endingSquare.firstChild;
                Chessboard.mangia(evento);
            }else{
                evento.target=endingSquare;
                Chessboard.sposta(evento);
            }
        }
    }
    //Chiede al server se l'aversario ha fatto una mossa
    static checkMove(){
        let invio={};
        //Segnala che è uan richiesta
        invio.request=true;
        //Il server vuole BIANCO->TRUE e NERO->false
        invio.player=(Chessboard.miaSquadra==BIANCO);
        
        fetch('match.php', {
            method: 'POST',
            body: JSON.stringify(invio),
            credentials: 'same-origin'
        })
        .then(response => response.text())
        .then(data => {
            if(data==="no"){
                //Se lavversario non ha fatto mosse aspetto un secondo e lo richiedo
                setTimeout(Chessboard.checkMove(), 1000);
            }else{
                let moves=data.split(";");
                let lastMove=moves[moves.length-2].split(",");
                //Controllo scacco/scacco matto;
                if(lastMove[2].charAt(2)){
                    //Scaccomatto
                    if(lastMove[2].charAt(2)=="#"){
                        Chessboard.messaggio("SCONFITTA","Scacco matto! La prossima volta andrà meglio...");
                    }
                    //Scacco
                    Chessboard.scacco=(lastMove[2].charAt(2)=="+");

                    //Resa
                    //Oppure rimuove il + e il # per spostare il pezzo
                    if(lastMove[2]=="Resa"){
                        Chessboard.messaggio("VITTORIA","L'avversario intimidito dalla tua forza, si è arreso");
                        Chessboard.abbandona.disabled=false;
                        return;
                    }else
                        lastMove[2]=String(lastMove[2].charAt(0))+String(lastMove[2].charAt(1));
                }
                //Permetto di abbandonare
                Chessboard.abbandona.disabled=false;
                Chessboard.aggiungiMossa(Chessboard.opposto(Chessboard.miaSquadra),lastMove[0],lastMove[1],lastMove[2]);
                Chessboard.movePiece(lastMove[0],lastMove[2]);
                if(Chessboard.scacco)
                    Chessboard.preparazioneScacco(lastMove[2],lastMove[1],Chessboard.opposto(Chessboard.miaSquadra));
                //Mi posso dinuovo muovere
                Chessboard.moveOpponent();
            }
        })
        .catch(error => {
            console.error("Errore",error);
            Chessboard.messaggio("OPS","Errore di connessione")
        });
    }
    // Prende in input i dati del pezzo avversario che fa scacco
    // casella deve essere una stringa fatta da letterascacco+numeroscacco
    // Segnala tutte le caselle in cui un pezzo si può piazzare per impedire lo scacco
    static preparazioneScacco(casella,pezzo,squadra){
        let squadraRe=Chessboard.opposto(squadra);
        document.getElementById(casella).classList.add("scacco");
        //il pedone e il cavallo possono solo essere mangiati (o evitati dal re)
        if(pezzo=="pedone"&&!Chessboard.provaDiScacco||pezzo=="cavallo"){
            return;
        }
        //Prendo la posizione del re
        let re=document.getElementsByClassName("re"+squadraRe);
        re=re[0];
        let [,,letteraRe,numeroRe]=re.id.split(",");

        let [letteraScacco,numeroScacco]=[casella.charAt(0),casella.charAt(1)]
        letteraScacco=letteraScacco.charCodeAt(0)
        //Segna tutte le caselle che separano il re dal pezzo che gli da scacco come caselle di scacco
        while(true){
            letteraRe=letteraRe.charCodeAt(0);
            if(letteraRe>letteraScacco)letteraRe=--letteraRe;
            if(letteraRe<letteraScacco)letteraRe=++letteraRe;
            if(numeroRe>numeroScacco)--numeroRe;
            if(numeroRe<numeroScacco)++numeroRe;
            if(letteraRe===letteraScacco&&numeroRe==numeroScacco)break;
            letteraRe=String.fromCharCode(letteraRe);
            document.getElementById(letteraRe+String(numeroRe)).classList.add("scacco")
        }

    }

    //Controlla se si è fatto scacco all'avversario dato il pezzo mosso, viene chiamato dopo ogni mossa
    static controlloScacco(pezzo,lettera,numero,squadra){
        Chessboard.scaccoAvversario=false;
        //Chiama ceUnoScacco sull'ultimo pezzo mosso
        Chessboard.selettoreDiMosse(pezzo,lettera,numero,squadra,Chessboard.ceUnoScacco,true,true);
    }

    //Controlla se sulla casella c'è il re e nel caso setta Chessboard.scaccoAvversario 
    static ceUnoScacco(lettera,numero,squadra){
        try{
            const casella=document.getElementById(lettera+String(numero))
            //se c'è un pezzo aversario controlla se è un re
            if(casella.classList.contains(Chessboard.opposto(squadra))&&casella.firstChild){
                let [pezzo,,,]=casella.firstChild.id.split(",")
                if(pezzo==="re"){
                    if(Chessboard.provaDiScacco)
                        Chessboard.scaccoFasullo=true;
                    else
                        Chessboard.scaccoAvversario=true;
                }
                return false;
            }
            //se c'è un pezzo della nostra squadra, smette di cercare in questa direzione
            if(casella.classList.contains(squadra)){
                return false;
            }
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }
    /* Queste due funzioni qua sotto servono a generare tutti i possibili punti in cui l'avversario può mangiare
     * e ad etichettarli come pericolosi. Vengono chiamati prima di evidenziare le possibili mosse di un re, per
     * evitare che questo si faccia auto scacco. Queste funzioni vengono anche chiamate quando si controlla se si è fatto uno scacco matto,
     * in modo da controllare se ha possibilita di muoversi il re.
     * Se è attivo ScaccoMatto controlla se una zona pericolosa si sovrappone con una zona
     * di scacco in questo caso non è scacco matto, perchè il re può essere salvato spostando un'altro pezzo tra il re e lo scacco
    */
    static evidenziaPuntiMangiabili(lettera,numero,squadra,nonMangiare=false,nonSpostarti=false){
        try{
            const casella=document.getElementById(lettera+String(numero))
            //Se c'è un pezzo avversario lo segna come pericolo (perchè può mangiarlo), e poi lo
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                //Se nonMangiare=true sono un pedone, e visto che =true vuol dire che mi sto spostando in avanti, non di lato per mangiare
                //ciò vuol dire che non se c'è un pezzo non può mangiare quindi non è pericolo  
                if(nonMangiare)
                    return false;
                casella.classList.add("pericolo");
                //Se si fa un controllo di scacco matto controlla sela casella contiente scacco nel caso resetta scaccoMatto
                if(Chessboard.scaccoMatto){
                    if(casella.classList.contains("scacco")){
                        Chessboard.scaccoMatto=false;
                    }
                }
                return false;
            }
            //se c'è un pezzo della mmia squadra lo segna come pericolo, perchè non può essere mangiato dal re, essendo "coperto" da un altro pezzo
            if(casella.classList.contains(squadra)){
                casella.classList.add("pericolo");
                return false;
            }
            //Se sto cercando degli scacchi matti il pedone non può muoversi di lato (nonMangiare=false, nonSpostarti=true) senza che ci sia un un pezzo
            if(Chessboard.scaccoMatto&&!nonMangiare&nonSpostarti)
                return false;

            casella.classList.add("pericolo");
            //Se si fa un controllo di scacco matto controlla se la casella contiente scacco nel caso resetta scaccoMatto
            if(Chessboard.scaccoMatto){
                if(casella.classList.contains("scacco")){
                    Chessboard.scaccoMatto=false;
                }
            }
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }
    //fa fare ad ogni pezzo una determinata funzione, che se non specificata è la generazione dei punti pericolosi della squadra data come argomento
    //se la squadra non viene data è la squadra avversaria
    //Settando salta re è possibile sltare il re
    static generaPostiPericolosi(squadraPredefinita=false,funzione=Chessboard.evidenziaPuntiMangiabili,saltaRe=false,nonSpostarePedone=true){
        let pezzi;
        //Seleziono tuti i pezzi della squadra
        if(squadraPredefinita===false)
            pezzi=document.querySelectorAll("#chessboard ."+Chessboard.opposto(Chessboard.miaSquadra));
        else
            pezzi=document.querySelectorAll("#chessboard ."+squadraPredefinita);
        
            let pezzo;
        for(pezzo of pezzi){
            let [tipoPezzo,squadra,lettera,numero]=pezzo.firstChild.id.split(",");
            if(saltaRe&&tipoPezzo=="re")
                continue;
            Chessboard.selettoreDiMosse(tipoPezzo,lettera,numero,squadra,funzione,nonSpostarePedone,true);
            //Se scacco ScaccoFasullo=true vuol dire che si stava facendo il rispettivo controllo quindi(prova di scacco era uguale a true)
            //Si salva in scacco fasullo il pezzo che causerebbe lo scacco
            if(Chessboard.scaccoFasullo){
                Chessboard.scaccoFasullo=document.getElementById(lettera+numero).firstChild;
                break;
            }
        }
    }
    //Controlla se c'è uno scacco matto chiamata dopo il controllo di uno scacco che ha avuto successo
    //Dati in input dell'ultimo pezzo mosso
    static controlloScaccoMatto(pezzo,lettera,numero){
        let re=document.getElementsByClassName("re"+(Chessboard.opposto(Chessboard.miaSquadra)));
        re=re[0];
        let [,squadraRe/*Avversaria*/,letteraRe,numeroRe]=re.id.split(",");
        Chessboard.scaccoMatto=true;
        //genero i posti in cui c'è scacco per il re avversario
        Chessboard.preparazioneScacco(/*casella*/String(lettera)+String(numero),pezzo,Chessboard.miaSquadra);
        //genero i posti pericolosi dell'avversario, cioè i posti dove lui può muovere o mangiare
        //controllo se un posto pericoloso si sovrapppone ad un posto scacco
        //questo vorrebbe dire che qualcuno può mettere a riparo del re in scacco
        Chessboard.generaPostiPericolosi(false,Chessboard.evidenziaPuntiMangiabili,true,false);
        Chessboard.rimuoviClasse("scacco");
        Chessboard.rimuoviClasse("pericolo");


        //Se nessuno dei suoi pezzi si può opporre al mio scacco
        if(Chessboard.scaccoMatto){
            //genero i miei posti pericolosi (considerando anche il mio re)
            //Rimuovo la classe della casella del re per fare in modo che i posti pericolosi vengano generati attraverso il re
            let casellaRe=re.parentElement;
            casellaRe.classList.remove(squadraRe);
            Chessboard.generaPostiPericolosi(Chessboard.miaSquadra);
            casellaRe.classList.add(squadraRe)
            //Controllo se ha dei posti in cui può muoversi che non siano pericolosi, in cui non ci siano pezzi suoi
            Chessboard.evidenziaRe(letteraRe,Number(numeroRe),squadraRe,Chessboard.siPuoMuovere,true);
        }
        Chessboard.rimuoviClasse("pericolo");
        if(Chessboard.scaccoMatto){
            //FINE PARTITA
            Chessboard.partitaFinita=true;
        }
    }
    
    //Controlla se in una posizione ci si può muovere, creata per controllare se il re si può muovere in caso di possibile scacco matto
    static siPuoMuovere(lettera, numero, squadra){
        //Se ha gia visto un posto in cui si può muovere non occorre che cerchi oltre
        if(!Chessboard.scaccoMatto)
            return false;
        try{
            const casella=document.getElementById(lettera+String(numero))
            //se c'è un pezzo aversario controlla se può mangiare (se può non è scacco matto)
            //se la casella è segnata come pericolo vuol dire che non può mangiarlo altrimenti verrebbe mangiato a sua volta
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                if(!casella.classList.contains("pericolo")){
                    Chessboard.scaccoMatto=false;
                }
                return false;
            }
            //se c'è un pezzo della nostra squadra, smette di cercare in questa direzione (non può mangiare la sua squadra)
            if(casella.classList.contains(squadra)){
                return false;
            }
            //Controlla se la casella vuota è una casella in cui può essere mangiato, se non è così non è scacco matto
            if(!casella.classList.contains("pericolo")){
                Chessboard.scaccoMatto=false;
            }
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }
    //Questa funzione viene chiamata prima di evidenziare le mosse serve a controllare se spostando il pezzo si farà un auto scacco
    //in quel caso blocca il movimento verra gestito come se fossimo sotto scacco permettendo solo i movimenti nelle caselle di scacco
    static controlloAutoScacco(casella){
        //Rimuove il pezzo avversario  
        const padre=casella.parentElement;
        padre.removeChild(casella);
        Chessboard.provaDiScacco=true;
        Chessboard.scaccoFasullo=false;
        //Controlla se in assenza del pezzo si ha uno scacco
        Chessboard.generaPostiPericolosi(false,Chessboard.ceUnoScacco);
        Chessboard.provaDiScacco=false;
        padre.appendChild(casella);
        //In caso si abbia uno scacco in scaccoFasullo si trova la casella che ha causato lo scacco
        if(Chessboard.scaccoFasullo){
            let [pezzoA,squadraA/*Avversaria*/,letteraA,numeroA]=Chessboard.scaccoFasullo.id.split(",");
            Chessboard.preparazioneScacco(letteraA+numeroA,pezzoA,squadraA);
        }
    }
}