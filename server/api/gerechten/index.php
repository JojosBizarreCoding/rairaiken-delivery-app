<?php

include_once '../config.php';

try {
    $stmt = $pdo->query("SELECT * FROM Gerechten");
    $gerechten = $stmt->fetchAll();
    echo json_encode($gerechten);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
}