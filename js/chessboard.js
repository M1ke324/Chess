let table;
const BIANCO="B";
const NERO="N";
const MAX_NUM=8;

const lettere=['a','b','c','d','e','f','g','h'];
document.addEventListener("DOMContentLoaded",()=>{
    Chessboard.createChessboard();
    Chessboard.setUpChessboard();
    
});

class Chessboard{
    scelto;


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
        for(let numero=8;numero>=1;numero--){
            const tr=document.createElement("tr");
            table.appendChild(tr);
            //Prima colonna con numero
            tr.id=numero;
            const td=document.createElement("td");
            td.textContent=String(numero);
            tr.appendChild(td);
            //Scacchiera vera e propria
            for(let lettera of lettere){
                const td=document.createElement("td");
                td.id=lettera+String(numero);
                tr.appendChild(td);
            }
        }

    }
    
    //squadra B->bianco; N->nero
    static posizionaPezzo(pezzo,lettera,numero,squadra){
        lettera=String(lettera).toLowerCase();
        const posto=document.getElementById(lettera+String(numero));
        posto.classList.add(squadra);
        const img=document.createElement("img");
        img.src=`img/pezzi/${pezzo+squadra}.png`;
        img.id=pezzo+","+squadra+","+lettera+","+numero;
        img.onclick=this.clickPezzo;
        posto.appendChild(img);
    }

    static setUpChessboard(){
        //Posizionamento dei pedoni
        for(let lettera of lettere){
            this.posizionaPezzo("pedone",lettera,2,BIANCO);
            this.posizionaPezzo("pedone",lettera,7,NERO);
        }

        //posizionamento torri
        this.posizionaPezzo("torre","a",1,BIANCO);
        this.posizionaPezzo("torre","h",1,BIANCO);
        this.posizionaPezzo("torre","a",8,NERO);
        this.posizionaPezzo("torre","h",8,NERO);

        //posizionamento alfieri;
        this.posizionaPezzo("alfiere","c",1,BIANCO);
        this.posizionaPezzo("alfiere","f",1,BIANCO);
        this.posizionaPezzo("alfiere","c",8,NERO);
        this.posizionaPezzo("alfiere","f",8,NERO);

        //posizionamento cavalli
        this.posizionaPezzo("cavallo","b",1,BIANCO);
        this.posizionaPezzo("cavallo","g",1,BIANCO);
        this.posizionaPezzo("cavallo","b",8,NERO);
        this.posizionaPezzo("cavallo","g",8,NERO);

        //posizionamento re
        this.posizionaPezzo("re","d",1,BIANCO);
        this.posizionaPezzo("re","d",8,NERO);
                
        //posizionamento re
        this.posizionaPezzo("regina","e",1,BIANCO);
        this.posizionaPezzo("regina","e",8,NERO);

    }

    static rimuoviEvidenziate(){
        const evidenziate=document.getElementsByClassName("evidenziata");
        while(0<evidenziate.length){
            evidenziate[0].onclick=null;
            evidenziate[0].classList.remove("evidenziata");
        }
        const avversari=document.getElementsByClassName("avversario");
        while(0<avversari.length){
            avversari[0].onclick=null;
            avversari[0].firstChild.onclick=Chessboard.clickPezzo;
            avversari[0].classList.remove("avversario");
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
        Chessboard.scelto.parentElement.classList.remove(squadra);
        Chessboard.scelto.parentElement.removeChild(Chessboard.scelto);
        casella.appendChild(Chessboard.scelto);
        casella.classList.add(squadra);
        Chessboard.scelto.id=pezzo+","+squadra+","+casella.id.charAt(0)+","+casella.id.charAt(1);
        Chessboard.rimuoviEvidenziate();
    }
    
    static mangia(e){
        const pezzoAvversario=e.target;
        const evento={};
        evento.target=pezzoAvversario.parentElement;
        let [,squadra,,]=pezzoAvversario.id.split(",");
        pezzoAvversario.parentElement.classList.remove(squadra);
        pezzoAvversario.parentElement.removeChild(pezzoAvversario);
        Chessboard.sposta(evento);
    }


    static evidenzia(lettera, numero,squadra,nonMangiare=false,nonSpostarti=false){
        try {
            const casella=document.getElementById(lettera+String(numero))
            //se c'è un pezzo aversario lo segnala per mangiarlo, a meno che sia un pedone
            if(casella.classList.contains(Chessboard.opposto(squadra))){
                if(!nonMangiare){
                    casella.classList.add("avversario");
                    casella.firstChild.onclick=Chessboard.mangia;
                }
                return false;
            }
            //non evidenzia sse c'è un pezzo della nostra squadra
            if(casella.classList.contains(squadra)){
                return false;
            }
            //se è un pedone non si sposta
            if(nonSpostarti)
                return false; 
            //Evidenzia il posto come possibile per il movimento
            casella.classList.add("evidenziata");
            casella.onclick=Chessboard.sposta;
            return true;
        } catch (error) {
            //Se esce dalla scacchiera avverte ritornando false
            return false;
        }
    }

    static evidenziaAlfiere(lettera,numero,squadra){
        let modificaLetteraA=lettera.charCodeAt(0);
        let modificaNumeroA=numero;
        while(Chessboard.evidenzia(String.fromCharCode(++modificaLetteraA),++modificaNumeroA,squadra));
        modificaLetteraA=lettera.charCodeAt(0);
        modificaNumeroA=numero;
        while(Chessboard.evidenzia(String.fromCharCode(--modificaLetteraA),--modificaNumeroA,squadra));
        modificaLetteraA=lettera.charCodeAt(0);
        modificaNumeroA=numero;
        while(Chessboard.evidenzia(String.fromCharCode(--modificaLetteraA),++modificaNumeroA,squadra));
        modificaLetteraA=lettera.charCodeAt(0);
        modificaNumeroA=numero;
        while(Chessboard.evidenzia(String.fromCharCode(++modificaLetteraA),--modificaNumeroA,squadra));
    }

    static evidenziaTorre(lettera,numero,squadra){
        let modificaLetteraT=lettera.charCodeAt(0);
        let modificaNumeroT=numero;
        while(Chessboard.evidenzia(String.fromCharCode(modificaLetteraT),++modificaNumeroT,squadra));
        modificaNumeroT=numero;
        while(Chessboard.evidenzia(String.fromCharCode(modificaLetteraT),--modificaNumeroT,squadra));
        modificaNumeroT=numero;
        while(Chessboard.evidenzia(String.fromCharCode(--modificaLetteraT),modificaNumeroT,squadra));
        modificaLetteraT=lettera.charCodeAt(0);
        while(Chessboard.evidenzia(String.fromCharCode(++modificaLetteraT),modificaNumeroT,squadra));
    }

    static evidenziaPedone(lettera,numero,squadra){
        let modificaLetteraP=lettera.charCodeAt(0)
        if(squadra==BIANCO&&numero<MAX_NUM){
            if(numero===2){
                Chessboard.evidenzia(lettera,numero+2,squadra,true,false);
            }
            Chessboard.evidenzia(lettera,numero+1,squadra,true,false);
            Chessboard.evidenzia(String.fromCharCode(modificaLetteraP+1),numero+1,squadra,false,true);
            Chessboard.evidenzia(String.fromCharCode(modificaLetteraP-1),numero+1,squadra,false,true);
        }
        if(squadra==NERO&&numero>2){
            if(numero===7){
                Chessboard.evidenzia(lettera,numero-2,squadra,true,false);
            }
            Chessboard.evidenzia(lettera,numero-1,squadra,true,false);
            Chessboard.evidenzia(String.fromCharCode(modificaLetteraP+1),numero-1,squadra,false,true);
            Chessboard.evidenzia(String.fromCharCode(modificaLetteraP-1),numero-1,squadra,false,true);
        }
    }

    static evidenziaRe(lettera,numero,squadra){
        for(let i=-1;i<=1;i++)
            for(let c=-1;c<=1;c++)
                if(c!=0||i!=0)
                    Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)+i),numero+c,squadra);
    }

    static evidenziaCavallo(lettera,numero,squadra){
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)+1),numero+2,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)-1),numero+2,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)+1),numero-2,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)-1),numero-2,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)+2),numero+1,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)-2),numero+1,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)+2),numero-1,squadra);
        Chessboard.evidenzia(String.fromCharCode(lettera.charCodeAt(0)-2),numero-1,squadra);
    }

    static evidenziaRegina(lettera,numero,squadra){
        Chessboard.evidenziaAlfiere(lettera,numero,squadra);
        Chessboard.evidenziaTorre(lettera,numero,squadra);
    }

    static clickPezzo(e){
        const target=e.target;
        let [pezzo,squadra,lettera,numero]=target.id.split(",");
        numero=Number(numero);
        
        //Rimuove le possibili mosse del pezzo premuto in precedenza
        Chessboard.rimuoviEvidenziate();
        Chessboard.scelto=target;
        
        switch (pezzo) {
            case "pedone":
                    Chessboard.evidenziaPedone(lettera,numero,squadra);
                break;
            case "cavallo":
                    Chessboard.evidenziaCavallo(lettera,numero,squadra);
                break;
            case "alfiere":
                    Chessboard.evidenziaAlfiere(lettera,numero,squadra);
                break;
            case "torre":
                    Chessboard.evidenziaTorre(lettera,numero,squadra);
                break;
            case "regina":
                    Chessboard.evidenziaRegina(lettera,numero,squadra);
                break;
            case "re":
                    Chessboard.evidenziaRe(lettera,numero,squadra);
                break;
        }
    }
}