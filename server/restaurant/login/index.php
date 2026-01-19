<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['HTTP_REFERER' == 'https://102710.stu.sd-lab.nl/rairaiken/restaurant/login/']) {
    if (!isset($_POST['naam'], $_POST['wachtwoord'])) {
        $error['login'] = 'Ongeldige invoer.';
        include_once 'view.php';
        exit();
    }
    
    require_once '../../api/config.php';
    try{
        $stmt = $pdo->prepare("SELECT * FROM Medewerkers WHERE Naam = :naam");
        $stmt->execute([
            ':naam' => $_POST['naam']
        ]);
        $Medewerker = $stmt->fetch();
        if ($Medewerker && password_verify($_POST['wachtwoord'], $Medewerker['Wachtwoord'])) {
            session_start();
            $_SESSION['MedewerkerID'] = $Medewerker['MedewerkerID'];
            $_SESSION['Naam'] = $Medewerker['Naam'];
            $_SESSION['Rol'] = $Medewerker['Rol'];
            header('Location: ../');
            exit();
        } else {
            $error['login'] = 'Ongeldige Medewerkersnaam of wachtwoord.';
        }
    } catch (PDOException $e) {
        $error['login'] = 'Serverfout. Probeer het later opnieuw.';
    }
}

include_once 'view.php';