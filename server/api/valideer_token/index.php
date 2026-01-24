<?php

require_once '../config.php';
require_once '../lib/jwt/JWT.php';
require_once '../lib/jwt/Key.php'; 
use Firebase\JWT\JWT;
use Firebase\JWT\Key; 

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['token'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Token is vereist']);
    exit;
} else {
    $token = $data['token'];
    $key = getenv('JWT_SECRET');
    try {
        
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        
        http_response_code(200);
        echo json_encode(['valid' => true, 'user_id' => $decoded->id, 'naam' => $decoded->naam]);
        exit;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['valid' => false, 'error' => 'Ongeldig token']);
        exit;
    }
}