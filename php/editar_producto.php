<?php
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit();
}

if (!isset($_GET['id'])) {
    die("Producto no especificado.");
}

$id = intval($_GET['id']);
$stmt = $conexion->prepare("SELECT * FROM productos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();
$producto = $resultado->fetch_assoc();

if (!$producto) {
    die("Producto no encontrado.");
}

// Si se envió el formulario para actualizar
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $descripcion = $_POST['descripcion'];
    $visible = isset($_POST['visible']) ? 1 : 0;
    
    $nombreImagen = $producto['imagen'];
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $nombreImagen = 'img/' . uniqid() . '.' . $ext;
        $rutaDestino = '../' . $nombreImagen;
        move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino);
    }

    $stmt = $conexion->prepare("UPDATE productos SET nombre=?, precio=?, descripcion=?, imagen=?, visible=? WHERE id=?");
    $stmt->bind_param("sdssii", $nombre, $precio, $descripcion, $nombreImagen, $visible, $id);
    $stmt->execute();

    header("Location: ../panel/panel.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Producto</title>
</head>
<body>
    <h1>Editar Producto</h1>
    <form action="" method="post" enctype="multipart/form-data">
        <label>Nombre:</label>
        <input type="text" name="nombre" value="<?= htmlspecialchars($producto['nombre']) ?>" required><br>

        <label>Precio:</label>
        <input type="number" name="precio" step="0.01" value="<?= $producto['precio'] ?>" required><br>

        <label>Descripción:</label>
        <textarea name="descripcion" required><?= htmlspecialchars($producto['descripcion']) ?></textarea><br>

        <label>Imagen actual:</label><br>
        <img src="img/<?= htmlspecialchars($producto['imagen']) ?>" alt="Imagen" width="150"><br>

        <label>Nueva imagen (opcional):</label>
        <input type="file" name="imagen"><br>

        <label>
            <input type="checkbox" name="visible" <?= $producto['visible'] ? 'checked' : '' ?>> Visible
        </label><br><br>

        <button type="submit">Actualizar</button>
        <a href="panel.php">Cancelar</a>
    </form>
</body>
</html>
