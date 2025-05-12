<?php
//registrar nuevos usuarios
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    // Encriptar la contraseña
    $hash = password_hash($contrasena, PASSWORD_DEFAULT);

    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, 'admin')");
    $stmt->bind_param("sss", $nombre, $correo, $hash);

    if ($stmt->execute()) {
        echo "Usuario registrado correctamente.";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conexion->close();
}
?>
