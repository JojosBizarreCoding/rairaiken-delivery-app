<?php
header("Content-Type: application/json");

include_once '../config.php';

$gerechtId = $_GET['id'] ?? null;
if ($gerechtId === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Gerecht ID is required']);
    exit;
}
try {
    $stmt = $pdo->prepare("SELECT * FROM Gerechten WHERE gerechtID = :id");
    $stmt->bindParam(':id', $gerechtId, PDO::PARAM_INT);
    $stmt->execute();
    $gerecht = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($gerecht) {
        $gerecht['Ingredienten'] = json_decode($gerecht['Ingredienten'], true);
        $gerecht['Allergenen'] = json_decode($gerecht['Allergenen'], true);
        echo json_encode($gerecht);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Gerecht niet gevonden']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query mislukt: ' . $e->getMessage()]);
}