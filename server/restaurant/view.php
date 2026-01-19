<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rairaiken Bestelling Overzicht</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
</head>

<body>
    <div class="container-fluid m-0 p-0">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Welkom <?= htmlspecialchars($_SESSION['Naam']); ?>!</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">

                    </ul>
                </div>
            </div>
        </nav>
        <div class="row">
            <div class="col-12">
                <h1 class="text-center my-4">Rairaiken Bestelling Overzicht</h1>
                <div class="container">
                    <?php foreach ($bestellingen as $bestelling): ?>
                        <div class="card mb-4">
                            <div class="card-header">
                                <strong>Bestelling ID:</strong> <?= htmlspecialchars($bestelling['BestellingID']); ?>
                                |
                                <strong>Gebruiker:</strong> <?= htmlspecialchars($bestelling['Naam']); ?> |
                                <strong>Besteld Op:</strong> <?= htmlspecialchars($bestelling['BesteldOp']); ?>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Bestelregels:</h5>
                                <ul class="list-group">
                                    <?php foreach ($bestelling['Regels'] as $regel): ?>
                                        <li class="list-group-item">
                                            <strong>Gerecht:</strong> <?= htmlspecialchars($regel['Gerecht']['Naam']); ?>
                                            |
                                            <strong>Aantal:</strong> <?= htmlspecialchars($regel['Aantal']); ?> |
                                            <strong>Opmerking:</strong>
                                            <?= htmlspecialchars($regel['Opmerking'] ?? 'Geen'); ?>
                                            <br>
                                            <em>Beschrijving:</em>
                                            <?= htmlspecialchars($regel['Gerecht']['Beschrijving']); ?>
                                            <br>
                                            <em>Ingredienten:</em>
                                            <?= htmlspecialchars(implode(', ', $regel['Gerecht']['Ingredienten'])); ?>
                                            <br>
                                            <em>Allergenen:</em>
                                            <?= htmlspecialchars(implode(', ', $regel['Gerecht']['Allergenen'])); ?>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

</body>

</html>