<?php

header('Content-Type: application/json');

include_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['email'], $data['wachtwoord'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}
try {
    $wachtwoord = sha1($data['wachtwoord']);
    $stmt = $pdo->prepare("SELECT * FROM Gebruikers WHERE Email = :email AND Wachtwoord = :wachtwoord");
    $stmt->execute([
        ':email' => $data['email'],
        ':wachtwoord' => $wachtwoord
    ]);
    $gebruiker = $stmt->fetch();
    if ($gebruiker) {
        echo json_encode(['message' => 'Login successful', 'user' => $gebruiker]);
        session_start();
        $_SESSION['GebruikerID'] = $gebruiker['GebruikerID'];
        $_SESSION['Naam'] = $gebruiker['Naam'];
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password', 'email' => $data['email'], 'wachtwoord' => $data['wachtwoord']]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}