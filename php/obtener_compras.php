<?php
header('Content-Type: application/json');
include("conexion.php");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

// Consulta con JOIN para obtener nombre de cliente y producto
$sql = "
SELECT 
    compras.id,
    usuarios.nombre AS cliente,
    productos.nombre AS producto,
    compras.cantidad,
    compras.fecha_compra,
    compras.enviado
    FROM compras
    JOIN usuarios ON compras.usuario_id = usuarios.id
    JOIN productos ON compras.producto_id = productos.id
    ORDER BY compras.fecha_compra DESC
";

$resultado = $conexion->query($sql);
$compras = [];

while ($fila = $resultado->fetch_assoc()) {
$compras[] = [
    "id" => $fila["id"], 
    "cliente" => $fila["cliente"],
    "producto" => $fila["producto"],
    "cantidad" => $fila["cantidad"],
    "fecha" => $fila["fecha_compra"],
    "enviado" => (bool)$fila["enviado"]
];
}

echo json_encode($compras);
$conexion->close();
?>
