<?php

session_start();
if (!isset($_SESSION['MedewerkerID'])|| !isset($_SESSION['Rol']) || !isset($_SESSION['Naam'])) {
   header('Location: ./login/');
   exit();
}

try {
   require_once '../api/config.php';
   // Haal alle bestellingen en bijbehorende gebruiker info op
   $stmt = $pdo->prepare("
   SELECT b.*, g.Naam, g.Telefoonnummer, g.Email, g.Straatnaam, g.Huisnummer, g.Postcode FROM Bestellingen b 
   JOIN Gebruikers g ON b.GebruikerID = g.GebruikerID
   ORDER BY b.BesteldOp DESC
   ");
   $stmt->execute();
   $bestellingen = $stmt->fetchAll(PDO::FETCH_ASSOC);

   // Haal alle bestelregels op voor de bestellingen
   $bestellingIds = array_column($bestellingen, 'BestellingID');
   if (count($bestellingIds) > 0) {
       $placeholders = implode(',', array_fill(0, count($bestellingIds), '?'));
       $stmt = $pdo->prepare("
       SELECT br.*, g.Naam AS GerechtNaam, g.Beschrijving, g.Ingredienten, g.Allergenen 
       FROM BestellingRegel br
       JOIN Gerechten g ON br.GerechtID = g.GerechtID
       WHERE br.BestellingID IN ($placeholders)
       ");
       $stmt->execute($bestellingIds);
       $regels = $stmt->fetchAll(PDO::FETCH_ASSOC);
   }

   // Groepeer regels per bestelling
   $regelsPerBestelling = [];
   foreach ($regels as $r) {
       $regelsPerBestelling[$r['BestellingID']][] = [
           'GerechtID'    => $r['GerechtID'],
           'Aantal'       => $r['Aantal'],
           'Opmerking'    => $r['Opmerking'],
           'Gerecht' => [
               'Naam'         => $r['GerechtNaam'],
               'Beschrijving' => $r['Beschrijving'],
               'Ingredienten' => json_decode($r['Ingredienten'], true),
               'Allergenen'   => json_decode($r['Allergenen'], true),
           ],
       ];
   }
   // Koppel regels aan bestellingen
   foreach ($bestellingen as &$b) {
       $b['Regels'] = $regelsPerBestelling[$b['BestellingID']] ?? [];
   }
} catch (PDOException $e) {
   die("Database error: " . $e->getMessage());
}

include_once 'view.php';