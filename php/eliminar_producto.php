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

// Eliminar imagen del servidor si existe
$stmt = $conexion->prepare("SELECT imagen FROM productos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$producto = $result->fetch_assoc();

if ($producto && !empty($producto['imagen'])) {
    $ruta = 'img/' . $producto['imagen'];
    if (file_exists($ruta)) {
        unlink($ruta);
    }
}

// Eliminar de la base de datos
$stmt = $conexion->prepare("DELETE FROM productos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
header("Location: ../panel/panel.php");
exit();
