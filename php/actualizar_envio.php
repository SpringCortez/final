<?php
header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "nutriapp");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$estado = $data['enviado'] ? 1 : 0;

$sql = "UPDATE compras SET enviado = $estado WHERE id = $id";

if ($conexion->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error al actualizar estado"]);
}

$conexion->close();
?>
