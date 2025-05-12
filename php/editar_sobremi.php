<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

if ($_SESSION['rol'] !== 'admin') {
    echo "Acceso denegado.";
    exit;
}

?>
