    <?php
        session_start();
        //Se si è già loggati funziona da logout
        if(isset($_SESSION['id'])){
            //Svuota tutte le variabili di sessione
            session_unset();
            //Elimina la sessione
            session_destroy();
        }

        include "config.php";
        
        function controlloDatiUtente($dati){
            //Rimuovo gli spazi bianchi dall'inizio/fine della stringa
            $dati = trim($dati);
            //Converto i caratteri speciali HTML in entità HTML, per prevenire attacchi XSS
            $dati = htmlspecialchars($dati);
            return $dati;
        }
        
        function controlloEmail($email) {
            $email = trim($email);
            //lascio i caratteri speciali permessi nelle mail, e tollgo gli altri
            return filter_var($email, FILTER_SANITIZE_EMAIL);
        }

        //Ferma l'esecuzione e manda il parametro al client in JSON
        function fine($response){
            echo json_encode($response);
            exit();
        }
        //Se username e password sono setttati vuol dire che non vuole la pagina html, ma la conferma delle credenziali
        if (isset($_POST['username']) && isset($_POST['password'])) {
            header('Content-Type: application/json');

            $response = [
                'success' => false,
                'message' => 'Errore sconosciuto'
            ];
            
            //rimuove gli spazzi e evita attacchi XSS
            $username = controlloDatiUtente($_POST['username']);
            $password = controlloDatiUtente($_POST['password']);
            
            //Controlla che username e password non siano vuoti
            if (empty($username)) {
                $response['message'] = 'Username richiesto';
                fine($response);
            }
            if (empty($password)) {
                $response['message'] = 'Password richiesta';
                fine($response);
            }
            //Controllo che username e password rispettino il formato
            $regExp="/^[A-Z][A-Z a-z 0-9]{4,}$/";
            if(!preg_match($regExp, $username)){
                $response['message']='Formato Username non valido';
                fine($response);
            }

            if(!preg_match($regExp, $password)){
                $response['message']='Formato Passwrod non valido';
                fine($response);
            }
            //Se è settato email vuol dire che non è una richiesta di accesso ma di registrazione
            if(isset($_POST['email'])){
                //Sanifico la mail
                $email = controlloEmail($_POST['email']);
                if (empty($username)) {
                    $response['message'] = 'Username richiesto';
                    fine($response);
                }
                //Faccio l'hash della password
                $password=password_hash($password,PASSWORD_BCRYPT);

                $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES ( ?, ?, ?)");
                if($stmt){
                    $stmt->bind_param("sss", $username,$email,$password);
                    if($stmt->execute()){
                        //Creo le varibili di sessione
                        $_SESSION['username'] = $username;
                        $_SESSION['id'] = $conn->insert_id;
                        $_SESSION['email'] = $email;
                        //dico all'utnente dove accedere
                        $response['success'] = true;
                        $response['message'] = 'registrazione effettuata con successo';
                        $response['redirect'] = 'index.php';
                    }else{
                        //Numero di errore per una violazione di unique 
                        if ($conn->errno == 1062) {
                            //Recupero il messaggio di errore
                            $messaggioErrore = $conn->error;
                    
                            //Identifico il campo UNIQUE violato, e lo comunico all'utente
                            if (strpos($messaggioErrore, 'email') !== false) {
                                $response['message'] = "L'email è già in uso.";
                            } elseif (strpos($messaggioErrore, 'username') !== false) {
                                $response['message'] = "L'username è già in uso.";
                            } else {
                                //Scrivo nel log gli errori per campi diversi da quelli di email e username
                                error_log("Errore di duplicato: " . $error_message);
                            }
                        } else {
                            //Scrivo nel log errori sonosciuto
                            error_log( "Errore durante l'inserimento: " . $mysqli->error);
                        }
                        fine($response);
                    }
                }else{
                    error_log('statement di registrazione non valido');
                }
            
            }else{
                //L'utente vuole accedere (non registrarsi)
                
                $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
                
                if ($stmt) {
                    $stmt->bind_param("s", $username);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows === 1) {
                        $row = $result->fetch_assoc();
                        if (password_verify($password,$row['password'])){
                            //Creo le varibili di sessione
                            $_SESSION['username'] = $row['username'];
                            $_SESSION['id'] = $row['id'];
                            $_SESSION['email'] = $row['email'];
                            //dico all'utnente dove accedere
                            $response['success'] = true;
                            $response['message'] = 'Login effettuato con successo';
                            $response['redirect'] = 'index.php';
                        }else{
                            $response['message'] = 'Password non valida';
                        } 
                    }else{
                        $response['message'] = 'Username non valido';
                    }
                }else{
                    error_log('statement non valido');
                }
            }
            fine($response);
        }
        ?>  
<!DOCTYPE html>
<html lang="it">
    <head>
    <link rel="icon" type="image/png" href="img/favicon.png" sizes="32x32">
    <link rel="stylesheet" href="css/login.css">
    <meta charset="UTF-8">
    <script src="js/login.js"></script>
    <title>Login</title>
</head>
<body>
    <h1>PAWN</h1>
    <form action="login.php" method="post" id="form">
        <table>
            <tr>
                <td>
                    <label for="username">Username</label>
                </td>
                <td>
                    <input type="text" name="username" id="username" placeholder="Username" pattern="^[A-Z][A-Z a-z 0-9]{4,}$">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="password">Password</label>
                </td>
                <td>
                    <input type="password" name="password" id="password" placeholder="Password" pattern="^[A-Z][A-Z a-z 0-9]{4,}$">
                </td>
            </tr>
            <tr>
                <td colspan="2" id="errori"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="submit" id="login">Login</button>
                </td>
            </tr>
        </table>
    </form>
    <button id="mostraRegistrati">Registrati</button>
    <form action="login.php" method="post" id="regForm">
        <table>
            <tr>
                <td>
                    <label for="usernameReg">Username</label>
                </td>
                <td>
                    <input type="text" name="username" id="usernameReg" placeholder="Username" pattern="^[A-Z][A-Z a-z 0-9]{4,}$">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="emailReg">Email</label>
                </td>
                <td>
                    <input type="email" name="email" id="emailReg" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="passwordReg">Password</label>
                </td>
                <td>
                    <input type="password" name="password" id="passwordReg" placeholder="Password" pattern="^[A-Z][A-Z a-z 0-9]{4,}$">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="confermaPasswordReg">Conferma password</label>
                </td>
                <td>
                    <input type="password" name="confermaPassword" id="confermaPasswordReg" placeholder="Confema la password" pattern="^[A-Z][A-Z a-z 0-9]{4,}$">
                </td>
            </tr>
            <tr>
                <td colspan="2" id="messaggio"><p>Username e Password devono iniziare con una lettera maiuscola e contenere almeno 5 caratteri non speciali.</p></td>
            </tr>
            <tr>
                <td colspan="2" id="erroriRegistrati"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="submit" id="registrati">Registrati</button>
                </td>
            </tr>
        </table>
    </form>
    <a href="documentazione.html" target="_blank" >Documentazione</a>
</body>
</html>