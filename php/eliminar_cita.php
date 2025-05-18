<?php
header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "nutriapp");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "error" => "ID no proporcionado"]);
    exit;
}

$id = (int)$data['id'];

$sql = "DELETE FROM citas WHERE id = $id";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}

$conexion->close();
?>
