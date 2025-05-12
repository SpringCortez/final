<?php
header('Content-Type: application/json');

// Configura los datos de conexión
$conexion = new mysqli("localhost", "root", "", "nutriapp");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

$sql = "SELECT id, nombre_paciente, correo_paciente, fecha_cita, hora_cita, descripcion, creada_por, creada_en FROM citas ORDER BY fecha_cita, hora_cita";
$resultado = $conexion->query($sql);

$citas = [];

while ($fila = $resultado->fetch_assoc()) {
    $citas[] = [
        "id" => $fila["id"],
        "nombre" => $fila["nombre_paciente"],
        "correo" => $fila["correo_paciente"],
        "fecha" => $fila["fecha_cita"],
        "hora" => $fila["hora_cita"],
        "motivo" => $fila["descripcion"],
        "creada_por" => $fila["creada_por"],
        "creada_en" => $fila["creada_en"]
    ];
}

echo json_encode($citas);

$conexion->close();
?>
