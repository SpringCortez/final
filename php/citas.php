<?php
header('Content-Type: application/json');

// Simulación de citas registradas (esto luego será reemplazado con una consulta a la base de datos)
$eventos = [
    [
        'title' => 'Disponible',
        'start' => '2025-05-04',
        'color' => 'green'
    ],
    [
        'title' => 'Ocupado',
        'start' => '2025-05-05',
        'color' => 'red'
    ]
];

// Devolver como JSON
echo json_encode($eventos);
?>
