<?php
include 'conexion.php';

// Validar que los campos estén presentes
if (!isset($_POST['id'], $_POST['titulo'], $_POST['descripcion'])) {
    echo "Faltan campos necesarios.";
    exit;
}

$id = $_POST['id'];
$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];

$imagenBinaria = null;

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $imagenBinaria = file_get_contents($_FILES['imagen']['tmp_name']);
} else {
    // Obtener imagen actual si no se subió una nueva
    $sql = "SELECT imagen FROM sobremi WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    if ($fila = $resultado->fetch_assoc()) {
        $imagenBinaria = $fila['imagen'];
    }
    $stmt->close();
}

$sql = "UPDATE sobremi SET titulo = ?, descripcion = ?, imagen = ? WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sssi", $titulo, $descripcion, $imagenBinaria, $id);

if ($stmt->execute()) {
    echo "Actualizado correctamente";
} else {
    echo "Error al actualizar: " . $conexion->error;
}

$stmt->close();
$conexion->close();
?>
