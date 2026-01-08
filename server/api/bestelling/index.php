<?php

include_once '../config.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        getBestellingen($pdo);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        createBestelling($pdo, $data);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);;
        exit;
}

function getBestellingen($pdo) {
    try {

    }
    catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createBestelling($pdo, $data) {
    try {

    }
    catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}