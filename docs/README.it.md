# PAWN
Pawn è un sito web che permette di giocare a scacchi contro altri utenti reali in un ambiente guidato, di tenere sott'occhio le proprie statistiche e la cronologia delle proprie partite.

## Funzionalità

Il sito integra nel gioco le seguenti funzionalità:

### Guida alle mosse
Al click di un pezzo vengono mostrate con il colore verde tutte le possibili mosse che il pezzo può fare, invece vengono colorate di rosso le caselle in cui è possibile mangiare un pezzo avversario. 
La visualizzazione delle mosse è sempre disponibile per tutti i pezzi; ma il movimento di questi ultimi è possibile solo per quelli appartenenti alla propria squadra e solo nel proprio turno. La possibilità di muovere un pezzo viene comunicata all'utente attraverso la modifica dell'aspetto del cursore del mouse, che viene mostrato come puntatore.

### Riconoscimento dello scacco
Dopo ogni turno vengono generate tutte le possibili mosse del pezzo appena spostato, se nella generazione si incontra una casella contenente il re viene segnalato lo scacco.

### Restrizioni in fase di scacco
Nel caso in cui il giocatore avversario ci faccia scacco, le nostre mosse saranno limitate alle sole caselle (colorate di blu) che permettono o di mangiare il pezzo attaccante o di interporre un pezzo tra il re e il pezzo attaccante (ad esclusione dei casi in cui quest'ultimo è un pedone o un cavallo).

### Scacco matto
Il sito permette il riconoscimento automatico dello scacco matto e la successiva terminazione della partita con l'assegnazione del punto al vincitore.

Il rilevamento dello scacco matto avviene in questo modo:
1. Il giocatore effettua uno scacco all'avvversario
2. Si generano le caselle di scacco (in cui è possibile o mangiare il pezzo che fa scacco, o difendere il re)
3. Vengono generate tutte le possibili mosse dell'avversario (a parte quelle del re), se esse si sovrappongono alle caselle di scacco, allora vuol dire che un pezzo può salvare il re. Perciò non è uno scacco matto. Altrimenti...
4. Vengono generate tutte le mosse del giocatore 
5. Si controllano le caselle adiacenti al re. Se si trovano solamente caselle contenenti pezzi propri o caselle segnalate come pericolose, allora si segnala lo scacco matto!

### Controllo autoscacco
Se è il proprio turno e si seleziona un proprio pezzo, prima di evidenziare le possibili mossse il pezzo viene rimosso, vengono generate tutte le mosse dell'avversario. Se queste mosse rivelano uno scacco allora vengono generate le "caselle di scaccco", che permettono di muovere il pezzo solo nei punti in cui non ci si espone ad uno scacco.

### Abbandono
È permesso abbandonare il gioco durante il proprio turno. È possibile capire se l'abbandono è consentito dalla saturazione dei colori del rispettivo pulsante.

### Ultima mossa
La casella di arrivo dell'ultimo pezzo mosso dall'avversario verrà colorata di arancione per 3 secondi in modo da evidenziare la mossa effettuata.

### Notazione scacchista
La notazione con cui sono segnate le mosse di scacchi è una modifica minimale della notazione scacchista effettivamente utilizzata: la notazione algebrica. Le modifiche effettuate sono servite a togliere le ambiguita. Ad esempio un cavallo che si muove da g1 a f3, invece di essere segnato come *Cf3* viene scritto come *g1 Cavallo f3*. È importante sottolineare che la notazione algebrica stessa prevede la scrittura della casella di partenza nel caso di ambiguità, regola che ho esteso a tutte le casistiche.

Come prevede la notazione originale una mossa che provoca uno scacco viene aggiuntao un '+' e nel caso di uno scacco matto un '#' alla fine. La resa non prevista dalla notazione algebrica viene scritta semplicemente come 'Resa'.

## Guida del sito

Le pagine disponibili sono 3:

### Login
È la pagina iniziale in cui è possibile loggarsi o registrarsi al sito attraverso gli appositi form, una volta fatto l'accesso si verrà reindirizzati alla home.

### Home
In questa pagina è possibile vedere le proprie statistiche e la cronologia delle partite effettuate. Premendo *Gioca* è possibile inziare il matchmaking di una partita che terminerà automaticamente, con l'inizio effettivo della partita, appena ci sarà un utente disponibile. 

### Gioco
In questa pagina si ha il gioco vero e proprio. In aggiunta è possibile vedere i dati dell'avversario come lo username e il numero di vittorie dell'avversario. Nella parte destra della pagina si ha l'elenco di tutte le mosse effettuate nella partita. L'unico modo per uscire da questa pagina è attraverso uno scacco matto o un abbandono, in questi casi il pulsante *Abbandona* viene trasformato in *Esci*.

## Come testarlo

Per provare a giocare una partita da soli bisogna loggarsi con due account diversi e su due browser diversi, per evitare che il secondo login sovrascriva la sessione del primo.

Le credeziali già disponibili per provarlo sono:

| Username | Password |
|----------|----------|
| Utente   | Prova    |
| Utente2  | Prova    |

Ovviamente è sempre possibile iscriversi tramite l'apposito form. Una volta loggati è possibile iniziare una partita premendo gioca su entrambi i browser.

## Struttura dei file

```
castrucci_636159
    ├── config.php
    ├── css
    │   ├── chessboard.css
    │   ├── login.css
    │   ├── mainBoard.css
    │   ├── match.css
    │   └── navbar.css
    ├── documentazione.html
    ├── img
    │   ├── board.png
    │   ├── favicon.png
    │   ├── loginBG.jpg
    │   └── pezzi
    │       ├── alfiereB.png
    │       ├── alfiereN.png
    │       ├── cavalloB.png
    │       ├── cavalloN.png
    │       ├── pedoneB.png
    │       ├── pedoneN.png
    │       ├── reB.png
    │       ├── reginaB.png
    │       ├── reginaN.png
    │       ├── reN.png
    │       ├── torreB.png
    │       └── torreN.png
    ├── index.php
    ├── js
    │   ├── chessboard.js
    │   ├── login.js
    │   └── mainBoard.js
    ├── login.php
    ├── matchmaking.php
    ├── match.php
    ├── navbar.php
    └── sql
        └── castrucci_636159.sql
```

---

**Crediti:**  
Icone: Flaticon.com  
Fotografo immagine di login: Hassan Pasha
