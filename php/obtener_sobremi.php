<?php
include 'conexion.php';

$sql = "SELECT * FROM sobremi LIMIT 1";
$resultado = $conexion->query($sql);

if ($fila = $resultado->fetch_assoc()) {
    // Convertir la imagen binaria a Base64
    $imagenBase64 = base64_encode($fila['imagen']);

    echo json_encode([
        "id" => $fila['id'],
        "titulo" => $fila['titulo'],
        "descripcion" => $fila['descripcion'],
        "imagen" => "data:image/jpg;base64," . $imagenBase64
    ]);
} else {
    echo json_encode(["error" => "No se encontraron datos."]);
}
?>
