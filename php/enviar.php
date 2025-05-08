<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST['nombre']);
    $correo = htmlspecialchars($_POST['email']);
    $motivo = htmlspecialchars($_POST['motivo']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    $destinatario = "TU_CORREO@ejemplo.com";
    $asunto = "Nuevo mensaje de $nombre: $motivo";

    $contenido = "Nombre: $nombre\n";
    $contenido .= "Correo: $correo\n";
    $contenido .= "Motivo: $motivo\n\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    $cabeceras = "From: $correo";

    if (mail($destinatario, $asunto, $contenido, $cabeceras)) {
        header("Location: contacto.html?estado=exito");
    } else {
        header("Location: contacto.html?estado=error");
    }
    exit;
}
?>
