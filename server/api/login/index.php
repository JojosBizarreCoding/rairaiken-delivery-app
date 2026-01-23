<?php

header('Content-Type: application/json');

include_once '../config.php';
require_once '../lib/jwt/JWT.php';
use Firebase\JWT\JWT;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Methode niet toegestaan']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['email'], $data['wachtwoord'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Ongeldige invoer']);
    exit;
}
try {
    $stmt = $pdo->prepare("SELECT Wachtwoord, Naam, GebruikerID FROM Gebruikers WHERE Email = :email");
    $stmt->execute([
        ':email' => $data['email']
    ]);
    $gebruiker = $stmt->fetch();
    if ($gebruiker && password_verify($data['wachtwoord'], $gebruiker['Wachtwoord'])) {
        $key = getenv('JWT_SECRET');
        $payload = [
            'id' => $gebruiker['GebruikerID'],
            'naam' => $gebruiker['Naam'],
            'iat' => time(),
            'exp' => time() + 60*60*24 // Token geldig voor 1 dag
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');
        echo json_encode(['token' => $jwt]);
        echo json_encode([
            'message' => 'Login succesvol',
            'user' => $gebruiker,
            'token' => $jwt
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Fout wachtwoord of email', 'email' => $data['email']]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Serverfout: ' . $e->getMessage()]);
}