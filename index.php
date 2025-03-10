    <?php
        session_start();
        include "config.php";
        
        function controlloDatiUtente($dati){
            $dati = trim($dati);
            $dati = htmlspecialchars($dati);
            return $dati;
        }
        
        function controlloEmail($email) {
            $email = trim($email);
            return filter_var($email, FILTER_SANITIZE_EMAIL);
        }

        function fine($response){
            echo json_encode($response);
            exit();
        }

        if (isset($_POST['username']) && isset($_POST['password'])) {
            header('Content-Type: application/json');

            $response = [
                'success' => false,
                'message' => 'Errore sconosciuto'
            ];
            
            //rimuove gli spazzi e evita attacchi XSS
            $username = controlloDatiUtente($_POST['username']);
            $password = controlloDatiUtente($_POST['password']);
            
            if (empty($username)) {
                $response['message'] = 'Username richiesto';
                fine($response);
            }
            if (empty($password)) {
                $response['message'] = 'Password richiesta';
                fine($response);
            }
            $regExp="/^[A-Z][a-z 0-9]{4,}$/";
            if(!preg_match($regExp, $username)){
                $response['message']='Formato Username non valido';
                fine($response);
            }

            if(isset($_POST['email'])){
                $email = controlloEmail($_POST['email']);
                if (empty($username)) {
                    $response['message'] = 'Username richiesto';
                    fine($response);
                }

                $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES ( ?, ?, ?)");
                if($stmt){
                    $stmt->bind_param("sss", $username,$email,$password);
                    if($stmt->execute()){

                        
                        $_SESSION['username'] = $username;
                        $_SESSION['id'] = $conn->insert_id;
                        $_SESSION['email'] = $email;
                        
                        $response['success'] = true;
                        $response['message'] = 'registrazione effettuata con successo';
                        $response['redirect'] = 'mainBoard.php';
                    }else{
                        if ($conn->errno == 1062) {
                            // Recupera il messaggio di errore
                            $messaggioErrore = $conn->error;
                    
                            // Identifica il campo UNIQUE violato
                            if (strpos($messaggioErrore, 'email') !== false) {
                                $response['message'] = "L'email è già in uso.";
                            } elseif (strpos($messaggioErrore, 'username') !== false) {
                                $response['message'] = "L'username è già in uso.";
                            } else {
                                error_log("Errore di duplicato: " . $error_message);
                            }
                        } else {
                            error_log( "Errore durante l'inserimento: " . $mysqli->error);
                        }
                        fine($response);
                    }
                }else{
                    error_log('statement di registrazione non valido');
                }
            
            }else{

                
                $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
                
                if ($stmt) {
                    $stmt->bind_param("s", $username);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows === 1) {
                        $row = $result->fetch_assoc();
                        if ($row['password'] === $password){
                            $_SESSION['username'] = $row['username'];
                            $_SESSION['id'] = $row['id'];
                            $_SESSION['email'] = $row['email'];
                            
                            $response['success'] = true;
                            $response['message'] = 'Login effettuato con successo';
                            $response['redirect'] = 'mainBoard.php';
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
<html lang="it">
    <head>
    <link rel="icon" type="image/png" href="img/favicon.png" sizes="32x32">
    <link rel="stylesheet" href="css/login.css">
    <meta charset="UTF-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script src="js/login.js"></script>
    <title>Login</title>
</head>
<body>
    <h1>PAWN</h1>
    <form action="" method="post" id="form">
        <table>
            <tr>
                <td>
                    <label for="username">Username</label>
                </td>
                <td>
                    <input type="text" name="username" id="username" placeholder="Username" pattern="^[A-Z][a-z 0-9]{4,}$" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="password">Password</label>
                </td>
                <td>
                    <input type="password" name="password" id="password" placeholder="Password" pattern="^[A-Z][a-z 0-9]{4,}$" required>
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
    <form action="" method="post" id="regForm">
        <table>
            <tr>
                <td>
                    <label for="usernameReg">Username</label>
                </td>
                <td>
                    <input type="text" name="username" id="usernameReg" placeholder="Username" pattern="^[A-Z][a-z 0-9]{4,}$" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="emailReg">Email</label>
                </td>
                <td>
                    <input type="email" name="email" id="emailReg" placeholder="email" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="passwordReg">Password</label>
                </td>
                <td>
                    <input type="password" name="password" id="passwordReg" placeholder="Password" pattern="^[A-Z][a-z 0-9]{4,}$" required>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="confermaPasswordReg">Conferma password</label>
                </td>
                <td>
                    <input type="password" name="confermaPassword" id="confermaPasswordReg" placeholder="Confema la password" pattern="^[A-Z][a-z 0-9]{4,}$" required>
                </td>
            </tr>
            <tr>
                <td colspan="2" id="messaggio"><p>Username e Password devono iniziare con una lettera maiuscola e contenere almeno 5 caratteri</p></td>
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
</body>
</html>