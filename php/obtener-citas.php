<?php
header('Content-Type: application/json');

$eventos = [
  ["title" => "Disponible", "start" => "2025-05-04", "color" => "green"],
  ["title" => "Ocupado", "start" => "2025-05-05", "color" => "red"],
];

echo json_encode($eventos);
?>
