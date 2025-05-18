<?php
require_once 'conexion.php';

$query = "SELECT * FROM productos";
$result = $conexion->query($query);

$productos = [];

while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($productos);
