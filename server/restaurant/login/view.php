<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rairaiken Medenwerkers login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h2 class="text-center mt-5">Rairaiken Medewerkers Login</h2>
                <?php if (isset($error['login'])): ?>
                    <div class="alert alert-danger" role="alert">
                        <?php echo htmlspecialchars($error['login']); ?>
                    </div>
                <?php endif; ?>
                <form action="./" method="POST" class="mt-4">
                    <div class="mb-3">
                        <label for="naam" class="form-label">Naam</label>
                        <input type="text" class="form-control" id="naam" name="naam" required>
                    </div>
                    <div class="mb-3">
                        <label for="wachtwoord" class="form-label">Wachtwoord</label>
                        <input type="password" class="form-control" id="wachtwoord" name="wachtwoord" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Inloggen</button>
                </form>
            </div>
        </div>
    </div>
    
</body>
</html>