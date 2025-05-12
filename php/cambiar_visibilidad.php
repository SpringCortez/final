<?php
require_once 'conexion.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo "ID no proporcionado";
    exit();
}

$id = intval($_GET['id']);
$query = "UPDATE productos SET visible = NOT visible WHERE id = ?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();

echo "Visibilidad actualizada";
