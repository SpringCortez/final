<?php
header('Content-Type: application/json');

// Conexión directa (puedes mover esto a conexion.php si quieres compartirlo)
$conexion = new mysqli("localhost", "root", "", "nutriapp");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos"]);
    exit;
}

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validación
if (
    !isset($data['id']) ||
    !isset($data['nombre']) ||
    !isset($data['fecha']) ||
    !isset($data['hora']) ||
    !isset($data['motivo'])
) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

// Escapar datos
$id = (int)$data['id'];
$nombre = $conexion->real_escape_string($data['nombre']);
$fecha = $conexion->real_escape_string($data['fecha']);
$hora = $conexion->real_escape_string($data['hora']);
$motivo = $conexion->real_escape_string($data['motivo']);

// Query de actualización
$sql = "UPDATE citas SET nombre_paciente = '$nombre', fecha_cita = '$fecha', hora_cita = '$hora', descripcion = '$motivo' WHERE id = $id";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}

$conexion->close();
?>
