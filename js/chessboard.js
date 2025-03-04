let table;
const BIANCO="B";
const NERO="N";

const lettere=['a','b','c','d','e','f','g','h'];
document.addEventListener("DOMContentLoaded",()=>{
    const colore=document.getElementById("colore");
    if(colore){
        if(colore.getAttribute("data-colore")=="N"){
            Chessboard.imBlack();
            Chessboard.doLoopRequest();
        }else
        Chessboard.imWhite();
    }
    Chessboard.createChessboard();
    Chessboard.setUpChessboard();
});

class Chessboard{
    static MAX_NUM=8;
    static scelto;
    static intervalCheckMove;
    static white;
    static move;
    static scaccoAvversario;
    static scacco;
    static scaccoMatto;
    static cercoScaccoMatto;
    static provaDiScacco;
    static scaccoFasullo;

    static imWhite(){
        Chessboard.white=true;
        Chessboard.move=true;
    }

    static imBlack(){
        Chessboard.white=false;
        Chessboard.move=false;
    }

    static moveOpponent(){
        Chessboard.move=!Chessboard.move;
    }

    static createChessboard(){
        table=document.getElementById("chessboard");
        //Lettera
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
            if(!Chessboard.white)
                num=Chessboard.MAX_NUM-numero+1;
            else
                num=numero
            const tr=document.createElement("tr");
            table.appendChild(tr);
            //Prima colonna con numero
            tr.id=num;
            const td=document.createElement("td");
            td.textContent=String(num);
            tr.appendChild(td);
            //Scacchiera vera e propria
            for(let lettera of lettere){
                const td=document.createElement("td");
                td.id=lettera+String(num);
                tr.appendChild(td);
            }
        }

    }
    
    //squadra B->bianco; N->nero
    static posizionaPezzo(pezzo,lettera,numero,squadra,classe=null){
        lettera=String(lettera).toLowerCase();
        const posto=document.getElementById(lettera+String(numero));
        posto.classList.add(squadra);
        const img=document.createElement("img");
        img.src=`img/pezzi/${pezzo+squadra}.png`;
        img.id=pezzo+","+squadra+","+lettera+","+numero;
        img.onclick=Chessboard.clickPezzo;
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

    static rimuoviEvidenziate(){
        Chessboard.rimuoviClasse("evidenziata",(casella)=>{casella.onclick=null;})
        Chessboard.rimuoviClasse("avversario",(casella)=>{casella.onclick=null;casella.firstChild.onclick=Chessboard.clickPezzo;})
        Chessboard.rimuoviClasse("pericolo");
        if(Chessboard.scaccoFasullo){
            Chessboard.scaccoFasullo=false;
            Chessboard.rimuoviClasse("scacco");
        }
    }

    static opposto(squadra){
        if(squadra==BIANCO)
            return NERO;
        else
            return BIANCO;
    }

    static sposta(e){
        const casella=e.target;
        let [pezzo,squadra,lettera,numero]= Chessboard.scelto.id.split(",");
        if(!Chessboard.move||Chessboard.white&&squadra==BIANCO||!Chessboard.white&&squadra==NERO){
            Chessboard.scelto.parentElement.classList.remove(squadra);
            Chessboard.scelto.parentElement.removeChild(Chessboard.scelto);
            casella.appendChild(Chessboard.scelto);
            casella.classList.add(squadra);
            Chessboard.scelto.id=pezzo+","+squadra+","+casella.id.charAt(0)+","+casella.id.charAt(1);
            Chessboard.rimuoviEvidenziate();
            if(Chessboard.move){
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
                    Chessboard.controlloScaccoMatto(pezzo,letteraNuova,numeroNuovo,squadra);
                }
                Chessboard.inviaMossa(lettera+numero,pezzo,casella.id);
            }
        }
    }
    
    static mangia(e){
        const pezzoAvversario=e.target;
        const evento={};
        evento.target=pezzoAvversario.parentElement;
        let [,squadra,,]=pezzoAvversario.id.split(",");
        if(!Chessboard.move||!Chessboard.white&&squadra==BIANCO||Chessboard.white&&squadra==NERO){
            pezzoAvversario.parentElement.classList.remove(squadra);
            pezzoAvversario.parentElement.removeChild(pezzoAvversario);
            Chessboard.sposta(evento);
        }
    }

    //Evidenzia una casella per indicarla come possibile per uno spostamento
    //Opzioni utili Sopratuttto per il pedone:
    //Non mangiare permette di specificare se si vuoe evitare di mangiare pezzi avversari nello spostamento
    //Non spostart serve ad indicare caselle dove si può arrivare solo mangiando
    //re serve a segnalare che sono un re, e a vietare le mosse che meterebbero i npericolo il re
    static evidenzia(lettera, numero,squadra,nonMangiare=false,nonSpostarti=false,re=false){
        try {
            const casella=document.getElementById(lettera+String(numero))

            //Se sono un re e la casella è pericolosa non mi posso spostare, neanche per mangiare
            if(re&&casella.classList.contains("pericolo")){
                return false;
            }

            /* Se non sono un re 
             * sono sotto scacco     
             * se la casella non è segnata come scacco
             * in quel caso non mi ci posso spostare
            */
            if(!re&&Chessboard.scacco&&!casella.classList.contains("scacco")){
                return false;
            }

            if(Chessboard.scaccoFasullo&&!casella.classList.contains("scacco")){
                return false;
            }
            
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                if(!nonMangiare){
                    casella.classList.add("avversario");
                    if(Chessboard.move)
                        casella.firstChild.onclick=Chessboard.mangia;
                }
                return false;
            }
            //non evidenzia se c'è un pezzo della nostra squadra
            if(casella.classList.contains(squadra)){
                return false;
            }
            //se è un pedone non si sposta
            if(nonSpostarti)
                return false; 
            //Evidenzia il posto come possibile per il movimento
            casella.classList.add("evidenziata");
            if(Chessboard.move)
                casella.onclick=Chessboard.sposta;
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }

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

    //evidenzia le possibili mosse del pedonenon evidenzia 
    //NonSportarti permette di selezionare solo le caselle in cui può mangiare ed evitare quelle in cui si sposta
    static evidenziaPedone(lettera,numero,squadra,funzione,nonSpostarti=false){
        let modificaLetteraP=lettera.charCodeAt(0);

        if(squadra==BIANCO&&numero<Chessboard.MAX_NUM){
            //Se è in posizione di partenza si può muovere di 2
            if(!nonSpostarti){
                if(numero===2){
                    funzione(lettera,numero+2,squadra,true,false);
                }
                funzione(lettera,numero+1,squadra,true,false);
            }
            funzione(String.fromCharCode(modificaLetteraP+1),numero+1,squadra,false,true);
            funzione(String.fromCharCode(modificaLetteraP-1),numero+1,squadra,false,true);
        }
        //uguale a sopra ma i pedoni neri si muovo in negativo rispetto ai numeri
        if(squadra==NERO&&numero>2){
            if(!nonSpostarti){
                if(numero===7){
                    funzione(lettera,numero-2,squadra,true,false);
                }
                funzione(lettera,numero-1,squadra,true,false);
            }
            funzione(String.fromCharCode(modificaLetteraP+1),numero-1,squadra,false,true);
            funzione(String.fromCharCode(modificaLetteraP-1),numero-1,squadra,false,true);
        }
    }

    static evidenziaRe(lettera,numero,squadra,funzione,evitaRicorsione=false){
        if(!evitaRicorsione)
            Chessboard.generaPostiPericolosi();
        for(let i=-1;i<=1;i++)
            for(let c=-1;c<=1;c++)
                if(c!=0||i!=0)
                    funzione(String.fromCharCode(lettera.charCodeAt(0)+i),numero+c,squadra,false,false,true);
    }

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
        Chessboard.scelto=target;
        Chessboard.controlloAutoScacco(pezzo,squadra,lettera,numero,e.target);
        Chessboard.selettoreDiMosse(pezzo,lettera,numero,squadra);
    }
    //Rende possibile eseguire su ogni casella in cui può muoversi un pezzo una funzione, default: evidenzia
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


    static inviaMossa(partenza,pezzo,arrivo){
        let invio={};
        invio.partenza=partenza;
        invio.pezzo=pezzo;
        let aggiunta=(Chessboard.scaccoMatto)?"#":((Chessboard.scaccoAvversario)?"+":"")
        invio.arrivo=arrivo+aggiunta;
        Chessboard.scaccoAvversario=false;
        fetch('match.php', {
            method: 'POST',
            body: JSON.stringify(invio),
            credentials: 'same-origin'
        })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            if(data==="done")
                Chessboard.moveOpponent();
                Chessboard.doLoopRequest();
            })
            .catch(error => {
                console.error('Errore:', error);
            });
        }
        
    static doLoopRequest(){            
        Chessboard.intervalCheckMove=setInterval(Chessboard.checkMove, 1000);
    }

    static movePiece(start,piece,end){
        const startingSquare=document.getElementById(start);
        const endingSquare=document.getElementById(end);
        if(startingSquare.firstChild){
            Chessboard.scelto=startingSquare.firstChild;
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
    static miaSquadra(){
        if(Chessboard.white)
            return BIANCO;
        else
            return NERO;
    }

    static checkMove(){
        let invio={};
        invio.request=true;
        invio.player=Chessboard.white;
        
        fetch('match.php', {
            method: 'POST',
            body: JSON.stringify(invio),
            credentials: 'same-origin'
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if(data!=="no"){
                clearInterval(Chessboard.intervalCheckMove);
                let moves=data.split(";");
                let lastMove=moves[moves.length-2].split(",");
                //Controllo scacco/scacco matto;
                if(lastMove[2].charAt(2)){
                    if(lastMove[2].charAt(2)=="#"){
                        //Scaccomatto
                        //TODO FINEPARITA
                        console.log("FINE PARTITA")
                    }
                    if(lastMove[2].charAt(2)=="+"){
                        //Scacco
                        Chessboard.scacco=true;
                    }
                    lastMove[2]=String(lastMove[2].charAt(0))+String(lastMove[2].charAt(1));
                }
                Chessboard.movePiece(lastMove[0],lastMove[1],lastMove[2]);
                if(Chessboard.scacco)
                    Chessboard.preparazioneScacco(lastMove[2],lastMove[1],Chessboard.opposto(Chessboard.miaSquadra()));
                    
                Chessboard.moveOpponent();
            }
        })
        .catch(error => {
            console.error('Errore:', error);
        });
    }
    // Segnala tutte le caselle in cui un pezzo si può piazzare per impedire lo scacco
    static preparazioneScacco(casella,pezzo,squadra){
        let squadraRe=Chessboard.opposto(squadra);
        document.getElementById(casella).classList.add("scacco");
        if(pezzo=="pedone"||pezzo=="cavallo"){
            return;
        }
        let re=document.getElementsByClassName("re"+squadraRe);
        re=re[0];
        let [,/*Avversaria*/,letteraRe,numeroRe]=re.id.split(",");
        let [letteraScacco,numeroScacco]=[casella.charAt(0),casella.charAt(1)]
        letteraScacco=letteraScacco.charCodeAt(0)
        while(true){
            letteraRe=letteraRe.charCodeAt(0);
            if(letteraRe>letteraScacco)letteraRe=String.fromCharCode(--letteraRe);
            if(letteraRe<letteraScacco)letteraRe=String.fromCharCode(++letteraRe);
            if(numeroRe>numeroScacco)--numeroRe;
            if(numeroRe<numeroScacco)++numeroRe;
            if(letteraRe===letteraScacco&&numeroRe==numeroScacco)break;
            document.getElementById(letteraRe+String(numeroRe)).classList.add("scacco")
        }

    }

    //Controlla se si è fatto scacco all'avversario dato il pezzo mosso, viene chiamato dopo ogni mossa
    static controlloScacco(pezzo,lettera,numero,squadra){
        console.log(pezzo,lettera,numero,squadra)
        Chessboard.scaccoAvversario=false;
        Chessboard.selettoreDiMosse(pezzo,lettera,numero,squadra,Chessboard.ceUnoScacco,true,true);
    }

    //Controlla se sulla casella c'è il re e nel caso setta Chessboard.scaccoAvversario
    static ceUnoScacco(lettera,numero,squadra){
        try{
            const casella=document.getElementById(lettera+String(numero))
            //se c'è un pezzo aversario controlla se è un re
            //console.log(casella);
            //console.log(squadra);
            if(casella.classList.contains(Chessboard.opposto(squadra))&&casella.firstChild){
                let [pezzo,,,]=casella.firstChild.id.split(",")
                if(pezzo==="re"){
                    if(Chessboard.provaDiScacco)
                        Chessboard.scaccoFasullo=casella.firstChild.id;
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
     * in modo da controllare se ha possibilita di muoversi il re. E se è attivo ScaccoMatto controlla se una zona pericolosa si sovrappone con una zona
     * di scacco in questo caso non è scacco matto, perchè il re può essere salvato spostando un'altro pezzo tra il re e lo scacco
    */
    static evidenziaPuntiMangiabili(lettera,numero,squadra,){
        try{
            const casella=document.getElementById(lettera+String(numero))
            //Sto selezionando le mosse dell'avversario, quindi se c'è un pezzo è mio non è pericolo e smette di cercare in quella direzione
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                return false;
            }
            //se c'è un pezzo della squadra avversaria, lo segna come pericolo per segnalarmi che non posso mangiarlo
            if(casella.classList.contains(squadra)){
                casella.classList.add("pericolo");
                if(Chessboard.cercoScaccoMatto){
                    if(casella.classList.contains("scacco")){
                        console.log("non è scacco matto, un pezzo può mangiare il pezzo che fa scacco")
                        Chessboard.scaccoMatto=false;
                    }
                }
                return false;
            }
            //altrimenti  l'avvversario identifica la casella come mangiabile e continua a spostarsi in quella direzione
            casella.classList.add("pericolo");
            if(Chessboard.cercoScaccoMatto){
                if(casella.classList.contains("scacco")){
                    console.log("non è scacco matto, un pezzo si può mettere nel mezzo")
                    Chessboard.scaccoMatto=false;
                }
            }
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }
    //fa fare ad ogni pezzo una determinata funzione, che se non specificata è la generazione dei punti pericolosi
    static generaPostiPericolosi(squadraPredefinita=false,scacco=false,funzione=Chessboard.evidenziaPuntiMangiabili){
        let pezzi;
        if(squadraPredefinita===false)
            pezzi=document.querySelectorAll("#chessboard ."+Chessboard.opposto(Chessboard.miaSquadra()));
        else
            pezzi=document.querySelectorAll("#chessboard ."+squadraPredefinita);
        
            let pezzo;
        if(scacco)
            Chessboard.cercoScaccoMatto=true;
        for(pezzo of pezzi){
            let [tipoPezzo,squadra,lettera,numero]=pezzo.firstChild.id.split(",");
            Chessboard.selettoreDiMosse(tipoPezzo,lettera,numero,squadra,funzione,true,true);
        }
        if(scacco)
            Chessboard.cercoScaccoMatto=false;
    }
    //Controlla se c'è uno scacco matto chiamata dopo il controllo di uno scacco che ha avuto successo, alla fine di ogni mossa
    static controlloScaccoMatto(pezzo,lettera,numero,squadra){
        let re=document.getElementsByClassName("re"+((Chessboard.white)?NERO:BIANCO));
        re=re[0];
        let [,squadraRe/*Avversaria*/,letteraRe,numeroRe]=re.id.split(",");
        Chessboard.scaccoMatto=true;
        //genero i posti in cui c'è scacco
        Chessboard.preparazioneScacco(/*casella*/String(lettera)+String(numero),pezzo,Chessboard.miaSquadra());
        //genero i posti pericolosi per il re avversario
        //controllo se un posto pericoloso si sovrapppone ad un posto scacco
        //c'ò vorrebbe dire che qualcuno si può mettere a riparo del re in scacco
        Chessboard.generaPostiPericolosi(Chessboard.miaSquadra(),true);
        if(!Chessboard.scaccoMatto){
            //Controllo se ha dei posti in cui può muoversi
            Chessboard.evidenziaRe(letteraRe,numeroRe,squadraRe,Chessboard.siPuoMuovere);
        }
        Chessboard.rimuoviClasse("scacco");
        Chessboard.rimuoviClasse("pericolo");
        if(Chessboard.scaccoMatto){
            Chessboard.scaccoMatto;
            //FINE PARTITA
            console.log("fine partita");
        }
    }
    
    //Controlla se in una posizione ci si può muovere, creata per controllare se c'è uno scacco
    static siPuoMuovere(lettera, numero, squadra){
        //Se ha gia visto un posot in cui si può muovere non occorre che cerchi oltre
        if(!Chessboard.scaccoMatto)
            return false;
        try{
            const casella=document.getElementById(lettera+String(numero))
            //se c'è un pezzo aversario controlla se può mangiare
            //se la casella è segnata come pericolo vuol dire che non può mangiarlo altrimenti verrebbe mangiato a sua volta
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                if(!casella.classList.contains("pericolo")){
                    Chessboard.scaccoMatto=false;
                    console.log("il re può uscire dallo scacco");
                }
                return false;
            }
            //se c'è un pezzo della nostra squadra, smette di cercare in questa direzione
            if(casella.classList.contains(squadra)){
                return false;
            }
            //Controlla se la casella vuota è una casella in cui può essere mangiato
            if(!casella.classList.contains("pericolo")){
                Chessboard.scaccoMatto=false;
                console.log("il re può uscire dallo scacco");
            }
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }
    /*Questa funzione chaimata prima di evidenziare le mosse serve a controllare se postando il pezzo si farà un auto scacco
        in quel caso blocca il movimento verra gestito come se fossimo sotto scacco permettendo solo i movimenti sotto scacco
    */
    static controlloAutoScacco(pezzo,squadra,lettera,numero,casella){
        const padre=casella.parentElement;
        padre.removeChild(casella);
        Chessboard.provaDiScacco=true;
        Chessboard.scaccoFasullo=false;
        Chessboard.generaPostiPericolosi(false,false,Chessboard.ceUnoScacco);
        Chessboard.provaDiScacco=false;
        padre.appendChild(casella);
        if(Chessboard.scaccoFasullo){
            let [pezzoA,squadraA/*Avversaria*/,letteraA,numeroA]=casella.id.split(",");
            Chessboard.preparazioneScacco(letteraA+numeroA,pezzoA,squadraA);
        }
    }
}