<?php
header('Content-Type: application/json');

include_once '../config.php';

require_once '../lib/jwt/JWT.php';
require_once '../lib/jwt/Key.php';
require_once '../lib/jwt/JWTExceptionWithPayloadInterface.php';
require_once '../lib/jwt/ExpiredException.php';
require_once '../lib/jwt/SignatureInvalidException.php';
require_once '../lib/jwt/BeforeValidException.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function validateJWT() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization']
        ?? $headers['authorization']
        ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '')
        ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Geen token (Authorization header) gevonden']);
        exit;
    }

    $jwt = $matches[1];
    $key = getenv('JWT_SECRET');

    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        return $decoded->id;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Ongeldig token', 'details' => $e->getMessage()]);
        exit;
    }
}

$userId = validateJWT();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        getBestellingen($pdo, $userId);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        createBestelling($pdo, $data, $userId);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Methode niet toegestaan']);
        exit;
}

function getBestellingen(PDO $pdo, $gebruikerId) {
    try {
        // Haal alle bestellingen van deze gebruiker op
        $stmt = $pdo->prepare("
            SELECT b.BestellingID, b.BesteldOp
            FROM Bestellingen b
            WHERE b.GebruikerID = :gebruikerId
            ORDER BY b.BesteldOp DESC
        ");
        $stmt->execute(['gebruikerId' => $gebruikerId]);
        $bestellingen = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$bestellingen) {
            echo json_encode([]);
            return;
        }

        // Verzamel IDs voor queries
        $bestellingIds = array_column($bestellingen, 'BestellingID');

        // Haal regels + gerecht-info in één query
        $bestellingIdPlaceholder = implode(',', array_fill(0, count($bestellingIds), '?'));
        $stmt = $pdo->prepare("
            SELECT br.BestellingID,
                   br.GerechtID,
                   br.Aantal,
                   br.Opmerking,
                   g.Naam,
                   g.Beschrijving,
                   g.Ingredienten,
                   g.Allergenen,
                   g.Plaatje
            FROM BestellingRegel br
            JOIN Gerechten g ON g.GerechtID = br.GerechtID
            WHERE br.BestellingID IN ($bestellingIdPlaceholder) -- hier wordt de lijst van IDs ingevoegd, die is opgehaald ui de vorige query
            ORDER BY br.BestellingID DESC
        ");
        $stmt->execute($bestellingIds);
        $regels = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Groepeer regels per bestelling
        $regelsPerBestelling = [];
        foreach ($regels as $r) {
            $regelsPerBestelling[$r['BestellingID']][] = [
                'GerechtID'    => $r['GerechtID'],
                'Aantal'       => $r['Aantal'],
                'Opmerking'    => $r['Opmerking'],
                'Gerecht' => [
                    'Naam'         => $r['Naam'],
                    'Beschrijving' => $r['Beschrijving'],
                    'Plaatje'      => $r['Plaatje'],
                    'Ingredienten' => json_decode($r['Ingredienten'], true),
                    'Allergenen'   => json_decode($r['Allergenen'], true),
                ],
            ];
        }

        // Koppel regels aan bestellingen
        foreach ($bestellingen as &$b) {
            $b['Regels'] = $regelsPerBestelling[$b['BestellingID']] ?? [];
        }
       echo json_encode($bestellingen);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database fout: ' . $e->getMessage()]);
    }
}

function createBestelling($pdo, $data, $gebruikerId) {
    try {
        // Begin met bestelling aan te maken
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO Bestellingen (GebruikerID, BesteldOp)
            VALUES (:gebruikerId, NOW())
        ");
        $stmt->execute(['gebruikerId' => $gebruikerId]);
        $bestellingId = $pdo->lastInsertId();

        // Regels samenvoegen als ze hetzelfde gerecht en opmerking hebben
        $merged = [];
        foreach ($data['regels'] as $regel) {
            $key = $regel['gerechtId'] . '|' . ($regel['opmerking'] ?? '');
            if (!isset($merged[$key])) {
                $merged[$key] = [
                    'gerechtId' => $regel['gerechtId'],
                    'aantal' => 0,
                    'opmerking' => $regel['opmerking'] ?? null
                ];
            }
            $merged[$key]['aantal'] += (int)$regel['aantal'];
        }

        $regelStmt = $pdo->prepare("
            INSERT INTO BestellingRegel (BestellingID, GerechtID, Aantal, Opmerking)
            VALUES (:bestellingId, :gerechtId, :aantal, :opmerking)
        ");
        foreach ($merged as $regel) {
            $regelStmt->execute([
                'bestellingId' => $bestellingId,
                'gerechtId'    => $regel['gerechtId'],
                'aantal'       => $regel['aantal'],
                'opmerking'    => $regel['opmerking']
            ]);
        }

        // Stop de bestelling in de database
        $pdo->commit();
        echo json_encode(['success' => true, 'bestellingId' => $bestellingId]);
    } catch (PDOException $e) {
        // Rollback bij fout, zodat er geen halve bestellingen in de databse komen
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database fout: ' . $e->getMessage()]);
    }
}