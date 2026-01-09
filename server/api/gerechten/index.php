<?php
header('Content-Type: application/json');

include_once '../config.php';

try {
    $stmt = $pdo->query("SELECT * FROM Gerechten");
    $gerechten = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($gerechten as &$gerecht) {
        $gerecht['Ingredienten'] = json_decode($gerecht['Ingredienten'], true);
        $gerecht['Allergenen'] = json_decode($gerecht['Allergenen'], true);
    }

    echo json_encode($gerechten);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}