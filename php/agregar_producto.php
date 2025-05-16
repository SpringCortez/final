<?php
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit();
}

// Procesar el formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $descripcion = $_POST['descripcion'];
    $visible = isset($_POST['visible']) ? 1 : 0;

    // Manejar subida de imagen
    $nombreImagen = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $nombreImagen = uniqid() . '.' . $ext;
        $rutaDestino = '../img/' . $nombreImagen;

        move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino);
    }
    

    $stmt = $conexion->prepare("INSERT INTO productos (nombre, precio, descripcion, imagen, visible) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdssi", $nombre, $precio, $descripcion, $nombreImagen, $visible);

    if ($stmt->execute()) {
        header("Location: panel.php");
        exit();
    } else {
        $error = "Error al guardar el producto.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Añadir Producto</title>
    <link rel="stylesheet" href="panel.css">
</head>
<body>
    <div class="main">
        <h1>Añadir Producto</h1>
        <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
        <form action="agregar_producto.php" method="post" enctype="multipart/form-data">
            <label for="nombre">Nombre del producto:</label>
            <input type="text" name="nombre" required><br>

            <label for="precio">Precio:</label>
            <input type="number" step="0.01" name="precio" required><br>

            <label for="descripcion">Descripción:</label>
            <textarea name="descripcion" rows="4" required></textarea><br>

            <label for="imagen">Imagen:</label>
            <input type="file" name="imagen" accept="image/*" required><br>

            <label>
                <input type="checkbox" name="visible" checked> Visible
            </label><br><br>

            <button type="submit">Guardar</button>
            <a href="panel.php">Cancelar</a>
        </form>
    </div>
</body>
</html>
