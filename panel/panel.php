<?php
session_start();
require_once '../php/conexion.php'; // tu archivo de conexión

// Protección de acceso:
if (!isset($_SESSION['usuario_id'])) {
   header("Location: ../login.html");
  exit();
}

$citas = [];
$sql = "SELECT * FROM citas";
$resultado = $conexion->query($sql);
if($resultado && $resultado->num_rows>0){
  while ($fila = $resultado->fetch_assoc()){
    $citas[] = $fila;
  }
}

// Obtener productos desde la base de datos
$productos = [];
$sql = "SELECT * FROM productos";
$resultado = $conexion->query($sql);
if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $productos[] = $fila;
    }
}

$resultado = $conexion->query("SELECT * FROM productos ORDER BY id DESC");
$productos = [];

while ($row = $resultado->fetch_assoc()) {
    $productos[] = $row;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Panel de Citas</title>
  <link rel="stylesheet" href="panel.css" />
</head>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vanillajs-datepicker@1.3.4/dist/css/datepicker.min.css">
<script src="https://cdn.jsdelivr.net/npm/vanillajs-datepicker@1.3.4/dist/js/datepicker-full.min.js"></script>

<body>
<div class="sidebar">
  <h2>Panel</h2>
  <ul>
    <li class="active">Citas</li>
    <li id="btn-productos">Tienda
      <span id="notificacion" class="notificacion"></span>
    </li>
    <li id="btn-configuracion">Configuración</li>
    <li>
      <a id="logout-btn" class="logout-boton" href="../php/logout.php">Cerrar sesión</a>
    </li>
  </ul>
</div>


  <div class="main">
    <header>
      <h1>Citas Agendadas</h1>
      <button id="nuevaCitaBtn">Nueva Cita</button>
    </header>
  
    <div id="contenidoPrincipal">
      <div id="citasContainer"></div>
      <div id="calendarioContainer">
        <h2>Calendario</h2>
        <div id="calendario"></div>
        <div id="infoFechaSeleccionada"></div>
      </div>
    </div>

    <div id="seccion-configuracion" class="flex"></div>
    <div id="seccion-admin-productos" class="flex">
      <h3>Gestión de Productos</h3>
  <button onclick="location.href='../php/agregar_producto.php'">+ Añadir Producto</button>

<section id="seccion-productos" class="block">
        <div style="margin: 1em 0;">
    <input type="text" id="busqueda-nombre" placeholder="Buscar por nombre" oninput="filtrarProductos()">
    <input type="number" step="0.01" id="busqueda-precio" placeholder="Buscar por precio" oninput="filtrarProductos()">
    <button onclick="resetearFiltros()">Limpiar filtros</button>
  </div>

  <div style="margin-bottom: 1em;">
    <button onclick="ordenarPorNombre()">Ordenar por Nombre</button>
    <button onclick="ordenarPorPrecio()">Ordenar por Precio</button>
  </div>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Visible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($productos as $producto): ?>
          <tr>
            <td><img src="../<?= htmlspecialchars($producto['imagen']) ?>" width="50" alt="Producto"></td>
            <td><?= htmlspecialchars($producto['nombre']) ?></td>
            <td>$<?= number_format($producto['precio'], 2) ?></td>
            <td><?= $producto['visible'] ? 'Sí' : 'No' ?></td>
            <td>
              <button onclick="editarProducto(<?= $producto['id'] ?>)">Editar</button>
              <button onclick="eliminarProducto(<?= $producto['id'] ?>)">Eliminar</button>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      </div>
    </section>

  <!-- Formulario oculto -->
  <div id="formulario-producto" class="oculto">
    <form id="productoForm" action="../php/agregar_producto.php" method="post" enctype="multipart/form-data">
      <input type="hidden" name="id" id="producto-id">
      <label>Nombre:</label>
      <input type="text" name="nombre" id="producto-nombre" required>
      <label>Precio:</label>
      <input type="number" step="0.01" name="precio" id="producto-precio" required>
      <label>Imagen:</label>
      <input type="file" name="imagen" id="producto-imagen">
      <label>Visible:</label>
      <select name="visible" id="producto-visible">
        <option value="1">Sí</option>
        <option value="0">No</option>
      </select>
      <button type="submit">Guardar</button>
      <button type="button" onclick="cancelarFormularioProducto()">Cancelar</button>
    </form>
  </div>
    </div>
    <div id="seccion-sobre-mi" class="oculto"></div>

  <!-- Modal de cita -->
  <div id="citaModal" class="modal">
    <div class="modal-content">
      <h2 id="modalTitulo">Nueva Cita</h2>
      <form id="citaForm" action="php/crear_citas.php" method="post">
        <label>Nombre del paciente:</label>
        <input type="text" id="nombre" required />

        <label>Fecha:</label>
        <input type="date" id="fecha" required />

        <label>Hora:</label>
        <input type="time" id="hora" required />

        <label>Motivo:</label>
        <input type="text" id="motivo" required />

        <div class="form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" id="cancelarBtn">Cancelar</button>
        </div>
      </form>
    </div>
  </div>


  <script>
    // Muestra/oculta la sección de productos desde la barra lateral
    document.getElementById('btn-productos').addEventListener('click', function () {
      document.getElementById('contenidoPrincipal').style.display = 'none';
      document.getElementById('seccion-productos').style.display = 'block';
    });
  </script>

  <script src="panel.js"></script>
</body>
</html>