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
      <li class="active">Citas</li>
      <li id="btn-productos">Productos
        <span id="notificacion" class="notificacion"></span>
      </li>
      <li>Configuración</li>
      <li>
          <a id="logout-btn" class="logout-boton" href="logout.php">Cerrar sesión</a>
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

    <!-- Sección de productos (tienda) -->
    <section id="seccion-productos" style="display: none;">
      <h2>Gestión de Productos</h2>
      <button onclick="location.href='../php/agregar_producto.php'">+ Añadir Producto</button>
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
            <td><img src="<?= htmlspecialchars($producto['imagen']) ?>" width="50"></td>
            <td><?= htmlspecialchars($producto['nombre']) ?></td>
            <td>$<?= number_format($producto['precio'], 2) ?></td>
            <td><?= $producto['visible'] ? 'Sí' : 'No' ?></td>
            <td>
              <a href="editar_producto.php=<?= $producto['id'] ?>">Editar</a> |
              <a href="eliminar_producto.php?id=<?= $producto['id'] ?>" onclick="return confirm('¿Eliminar este producto?')">Eliminar</a> |
              <a href="toggle_visibilidad.php?id=<?= $producto['id'] ?>">Cambiar Visibilidad</a>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </section>
  </div>
  
  <!-- Modal de cita -->
  <div id="citaModal" class="modal">
    <div class="modal-content">
      <h2 id="modalTitulo">Nueva Cita</h2>
      <form id="citaForm" action="php/crear_citas.php" method="post"> <!--Si esta guardando en la base de datos, pero no esta pasando la informacion-->
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