    <?php
        session_start();
        include "config.php";
        
        function controlloDatiUtente($dati){
            $dati = trim($dati);
            $dati = stripslashes($dati);
            $dati = htmlspecialchars($dati);
            return $dati;
        }

        function fine($response){
            error_log(json_encode($response));
            echo json_encode($response);
            exit();
        }
        
        if (isset($_POST['username']) && isset($_POST['password'])) {
            header('Content-Type: application/json');

            $response = [
                'success' => false,
                'message' => 'Errore sconosciuto'
            ];

            //rimuove gli spazzi, slashes e evita attacchi XSS

            $username = controlloDatiUtente($_POST['username']);
            $password = controlloDatiUtente($_POST['password']);
            
            if (empty($username)) {
                $response['message'] = 'Username richiesto';
                fine($response);
            } else if (empty($password)) {
                $response['message'] = 'Password richiesta';
                fine($response);
            }
            $regExp="/^[A-Z][a-z 0-9]{4,}$/";
            if(!preg_match($regExp, $username)||!preg_match($regExp, $password)){
                if(!preg_match($regExp, $username)){
                    $response['message']='Formato Username non valido';
                }else{
                    $response['message']='Formato Password non valido';
                }
                fine($response);
            }

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
                        $response['redirect'] = 'chessboard.php';
                    }else{
                        $response['message'] = 'Password non valida';
                    } 
                }else{
                    $response['message'] = 'Username non valido';
                }
            }else{
                error_log('statement non valido');
            }
            fine($response);
        }
    ?>  
<html lang="it">
<head>
    <link rel="stylesheet" href="css/login.css">
    <meta charset="UTF-8">
    <script src="js/login.js"></script>
    <title>Login</title>
</head>
<body>
    <form action="" method="post" id="form">
        <table>
            <tr>
                <td>
                    <label for="username">Username</label>
                </td>
                <td>
                    <input type="text" name="username" id="username" placeholder="Username" pattern="^[A-Z][a-z 0-9]{4,}$">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="password">Password</label>
                </td>
                <td>
                    <input type="password" name="password" id="password" placeholder="Password" pattern="^[A-Z][a-z 0-9]{4,}$">
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
</body>
</html>