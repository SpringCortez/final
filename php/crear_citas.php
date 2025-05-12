<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "nutriapp");

if ($conexion->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos"]);
    exit;
}

// Recibir los datos JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar que existan todos los datos
if (
    !isset($data['nombre']) ||
    !isset($data['fecha']) ||
    !isset($data['hora']) ||
    !isset($data['motivo']) ||
    !isset($data['creada_por'])
) {
    echo json_encode(["success" => false, "error" => "Faltan datos requeridos"]);
    exit;
}

// Preparar los datos
$nombre = $conexion->real_escape_string($data['nombre']);
$correo = ''; 
$fecha = $conexion->real_escape_string($data['fecha']);
$hora = $conexion->real_escape_string($data['hora']);
$motivo = $conexion->real_escape_string($data['motivo']);
$creada_por = (int)$data['creada_por'];

// Insertar en la tabla de citas
$sql = "INSERT INTO citas (nombre_paciente, correo_paciente, fecha_cita, hora_cita, descripcion, creada_por, creada_en)
        VALUES ('$nombre', '$correo', '$fecha', '$hora', '$motivo', $creada_por, NOW())";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}

$conexion->close();
