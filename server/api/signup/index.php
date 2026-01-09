<?php

header('Content-Type: application/json');


include_once '../config.php';

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['naam'], $data['telefoonnummer'], $data['email'], $data['wachtwoord'], $data['straatnaam'], $data['huisnummer'], $data['postcode'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}
try {
    $stmt = $pdo->prepare("INSERT INTO Gebruikers (Naam, Telefoonnummer, Email, Wachtwoord, Straatnaam, Huisnummer, Postcode) VALUES (:naam, :telefoonnummer, :email, :wachtwoord, :straatnaam, :huisnummer, :postcode)");
    $stmt->execute([
        ':naam' => $data['naam'],
        ':telefoonnummer' => $data['telefoonnummer'],
        ':email' => $data['email'],
        ':wachtwoord' => sha1($data['wachtwoord']),
        ':straatnaam' => $data['straatnaam'],
        ':huisnummer' => $data['huisnummer'],
        ':postcode' => $data['postcode']
    ]);
    echo json_encode(['message' => 'User registered successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}