CREATE TABLE IF NOT EXISTS `Gerechten` (
  `GerechtID` INT NOT NULL AUTO_INCREMENT,
  `Naam` VARCHAR(100) NOT NULL,
  `Beschrijving` TEXT,
  `Ingredienten` TEXT,
  `Allergenen` TEXT,
  PRIMARY KEY (`GerechtID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Gebruikers` (
  `GebruikerID` INT NOT NULL AUTO_INCREMENT,
  `Naam` VARCHAR(100) NOT NULL,
  `Telefoonnummer` VARCHAR(20),
  `Email` VARCHAR(255) NOT NULL UNIQUE,
  `Wachtwoord` VARCHAR(255) NOT NULL,
  `Straatnaam` VARCHAR(100) NOT NULL,
  `Huisnummer` VARCHAR(10) NOT NULL,
  `Postcode` VARCHAR(12) NOT NULL,
  `Tijdelijk` BOOLEAN NOT NULL DEFAULT FALSE,
  `AanmaakDatum` DATE NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (`GebruikerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Bestellingen` (
  `BestellingID` INT NOT NULL AUTO_INCREMENT,
  `GebruikerID` INT NOT NULL,
  `BesteldOp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BestellingID`),
  INDEX `idx_bestellingen_gebruiker` (`GebruikerID`),
  CONSTRAINT `fk_bestelling_gebruiker`
    FOREIGN KEY (`GebruikerID`)
    REFERENCES `Gebruikers`(`GebruikerID`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `BestellingRegel` (
  `BestellingID` INT NOT NULL,
  `GerechtID` INT NOT NULL,
  `Aantal` INT NOT NULL DEFAULT 1,
  `Opmerking` TEXT,
  PRIMARY KEY (`BestellingID`, `GerechtID`),
  CONSTRAINT `fk_regel_bestelling`
    FOREIGN KEY (`BestellingID`)
    REFERENCES `Bestellingen`(`BestellingID`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_regel_gerecht`
    FOREIGN KEY (`GerechtID`)
    REFERENCES `Gerechten`(`GerechtID`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

