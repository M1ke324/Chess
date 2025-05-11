# PAWN

Original text in 🇮🇹 [Italiano](docs/README.it.md)

Pawn is a website that allows you to play chess against other real users in a guided environment, keep track of your statistics and the history of your games.

## Features

The site integrates the following features into the game:

### Move Guide
When clicking on a piece, all possible moves are displayed in green, while squares where you can capture an opponent's piece are colored in red. 
Move visualization is always available for all pieces; but movement is only possible for pieces belonging to your team and only during your turn. The ability to move a piece is communicated to the user through the change in the appearance of the mouse cursor, which is shown as a pointer.

### Check Recognition
After each turn, all possible moves of the piece just moved are generated. If a square containing the king is encountered during this generation, check is signaled.

### Restrictions during Check
If the opposing player puts you in check, your moves will be limited to only those squares (colored blue) that allow you to either capture the attacking piece or place a piece between the king and the attacking piece (except in cases where the latter is a pawn or a knight).

### Checkmate
The site allows automatic recognition of checkmate and the subsequent termination of the game with the assignment of the point to the winner.

Checkmate detection occurs in this way:
1. The player puts the opponent in check
2. The check squares are generated (where it is possible to either capture the piece making the check or defend the king)
3. All possible moves of the opponent are generated (except those of the king). If they overlap with the check squares, it means that a piece can save the king. So it's not a checkmate. Otherwise...
4. All moves of the player are generated
5. The squares adjacent to the king are checked. If only squares containing your own pieces or squares signaled as dangerous are found, then checkmate is declared!

### Self-Check Control
If it's your turn and you select one of your pieces, before highlighting the possible moves, the piece is removed, and all the opponent's moves are generated. If these moves reveal a check, then "check squares" are generated, which allow you to move the piece only to points where you don't expose yourself to a check.

### Resignation
It is allowed to resign from the game during your turn. You can tell if resignation is allowed by the saturation of the colors of the respective button.

### Last Move
The destination square of the last piece moved by the opponent will be colored orange for 3 seconds to highlight the move made.

### Chess Notation
The notation used to mark chess moves is a minimal modification of the actual chess notation used: algebraic notation. The modifications made served to remove ambiguities. For example, a knight moving from g1 to f3, instead of being marked as *Nf3* is written as *g1 Knight f3*. It's important to emphasize that algebraic notation itself includes writing the starting square in case of ambiguity, a rule that I have extended to all cases.

As the original notation provides, a move that causes a check adds a '+' at the end, and in the case of a checkmate, a '#'. Resignation, not provided for by algebraic notation, is simply written as 'Resignation'.

## Site Guide

There are 3 available pages:

### Login
This is the initial page where you can log in or register on the site through the appropriate forms. Once logged in, you will be redirected to the home page.

### Home
On this page, you can see your statistics and the history of your games. By pressing *Play*, you can start matchmaking for a game that will automatically end, with the actual start of the game, as soon as a user is available.

### Game
On this page, you have the actual game. Additionally, you can see the opponent's data such as the username and the number of wins of the opponent. On the right side of the page, you have a list of all the moves made in the match. The only way to exit this page is through a checkmate or a resignation. In these cases, the *Resign* button is transformed into *Exit*.

## How to Test It

To try playing a game alone, you need to log in with two different accounts and on two different browsers, to prevent the second login from overwriting the session of the first.

The credentials already available to try it are:

| Username | Password | \
|──────────|──────────| \
| Utente   | Prova    | \
| Utente2  | Prova    | \

Of course, it is always possible to register through the appropriate form. Once logged in, you can start a game by pressing play on both browsers.

## File Structure

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

**Credits:**  
Icons: Flaticon.com  
Login image photographer: Hassan Pasha

---

*This README has been translated from Italian to English by an AI translator.*
