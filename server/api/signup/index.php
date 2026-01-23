<?php

header('Content-Type: application/json');


include_once '../config.php';
require_once '../lib/jwt/JWT.php';
use Firebase\JWT\JWT;

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
if (
    empty($data['naam']) ||
    empty($data['wachtwoord']) ||
    empty($data['straatnaam'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Ongeldige invoer']);
    exit;
}
$data['email'] = strtolower($data['email']);
$data['postcode'] = strtoupper($data['postcode']);
$emailDuplicateCheck = $pdo->prepare("SELECT COUNT(*) FROM Gebruikers WHERE Email = :email");
$emailDuplicateCheck->execute([':email' => $data['email']]);
if ($emailDuplicateCheck->fetchColumn() > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'E-mailadres is al in gebruik']);
    exit;
}
switch (true) {
    case !filter_var($data['email'], FILTER_VALIDATE_EMAIL):
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldig e-mailadres']);
        exit;
    case strlen($data['wachtwoord']) < 8:
        http_response_code(400);
        echo json_encode(['error' => 'Wachtwoord moet minimaal 8 tekens lang zijn']);
        exit;
    case !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/', $data['wachtwoord']):
        http_response_code(400);
        echo json_encode(['error' => 'Wachtwoord moet minimaal één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevatten']);
        exit;
    case !preg_match('/[1-9][0-9]{3}\s?[A-Z]{2}/', $data['postcode']):
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldige postcode']);
        exit;
    case !preg_match('/0[1-9][0-9]{8}/', $data['telefoonnummer']):
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldig telefoonnummer']);
        exit;
    case !is_numeric($data['huisnummer']) || (int) $data['huisnummer'] <= 0:
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldig huisnummer']);
        exit;
}
try {
    $stmt = $pdo->prepare("INSERT INTO Gebruikers (Naam, Telefoonnummer, Email, Wachtwoord, Straatnaam, Huisnummer, Postcode) VALUES (:naam, :telefoonnummer, :email, :wachtwoord, :straatnaam, :huisnummer, :postcode)");
    $stmt->execute([
        ':naam' => $data['naam'],
        ':telefoonnummer' => $data['telefoonnummer'],
        ':email' => $data['email'],
        ':wachtwoord' => password_hash($data['wachtwoord'], PASSWORD_BCRYPT),
        ':straatnaam' => $data['straatnaam'],
        ':huisnummer' => $data['huisnummer'],
        ':postcode' => $data['postcode']
    ]);
    $userId = $pdo->lastInsertId();
    $key = getenv('JWT_SECRET');
    $payload = [
        'id' => $userId,
        'naam' => $data['naam'],
        'iat' => time(),
        'exp' => time() + 60*60*24 // 1 dag geldig
    ];
    $jwt = JWT::encode($payload, $key, 'HS256');
    echo json_encode([
        'message' => 'Gebruiker succesvol geregistreerd',
        'token' => $jwt
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Databasefout: ' . $e->getMessage()]);
}