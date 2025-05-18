<?php
header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "nutriapp");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

// Revisamos si hay compras pendientes de envío
$sql = "SELECT COUNT(*) AS total FROM compras WHERE enviado = 0";
$resultado = $conexion->query($sql);
$fila = $resultado->fetch_assoc();

echo json_encode([
    "hayNovedades" => $fila["total"] > 0
]);

$conexion->close();
?>
