
document.addEventListener("DOMContentLoaded", () => {
  const secciones = {
    "Citas": document.getElementById("contenidoPrincipal"),
    "Productos": document.getElementById("seccion-productos"),
  };

  const menuItems = document.querySelectorAll(".sidebar ul li");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      // Remover clase activa de todos
      menuItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      // Ocultar todas las secciones
      Object.values(secciones).forEach(sec => sec.style.display = "none");

      // Mostrar la sección correspondiente
      const nombreSeccion = item.textContent.trim();
      if (secciones[nombreSeccion]) {
        secciones[nombreSeccion].style.display = "block";
      }
    });
  });

  const inputCalendario = document.getElementById("calendario");

  // Inicializar calendario
  const datepicker = new Datepicker(inputCalendario, {
    language: 'es',
    autohide: true,
    todayHighlight: true
  });
  
const citasContainer = document.getElementById("citasContainer");
const nuevaCitaBtn = document.getElementById("nuevaCitaBtn");
const citaModal = document.getElementById("citaModal");
const citaForm = document.getElementById("citaForm");
const cancelarBtn = document.getElementById("cancelarBtn");
const modalTitulo = document.getElementById("modalTitulo");

const nombreInput = document.getElementById("nombre");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const motivoInput = document.getElementById("motivo");

let citas = [];
let editandoIndex = null;

function mostrarModal(titulo = "Nueva Cita") {
  modalTitulo.textContent = titulo;
  citaModal.style.display = "block";
}

function cerrarModal() {
  citaModal.style.display = "none";
  citaForm.reset();
  editandoIndex = null;
}
fetch("./php/obtener_citas.php")
  .then(response => response.json())
  .then(data => {
    citas = data;
    renderCitas();
    marcarDiasConCitas();
  })
  .catch(error => {
    console.error("Error al cargar las citas:", error);
  });
function renderCitas() {
  citasContainer.innerHTML = "";
  citas.forEach((cita, index) => {
    const citaDiv = document.createElement("div");
    citaDiv.className = "cita" + (cita.hecha ? " hecha" : "");
    citaDiv.innerHTML = `
      <div>
        <strong>${cita.fecha} - ${cita.hora}</strong><br />
        ${cita.nombre} - ${cita.motivo}
      </div>
      <div class="cita-controls">
        <button class="editar">Editar</button>
        <button class="hecha">${cita.hecha ? "Desmarcar" : "Hecha"}</button>
        <button class="eliminar">Eliminar</button>
      </div>
    `;

    citaDiv.querySelector(".editar").onclick = () => {
      editandoIndex = index;
      nombreInput.value = cita.nombre;
      fechaInput.value = cita.fecha;
      horaInput.value = cita.hora;
      motivoInput.value = cita.motivo;
      mostrarModal("Editar Cita");
    };

    citaDiv.querySelector(".hecha").onclick = () => {
      citas[index].hecha = !citas[index].hecha;
      renderCitas();
    };

    citaDiv.querySelector(".eliminar").onclick = () => {
      if (confirm("¿Eliminar esta cita?")) {
        citas.splice(index, 1);
        renderCitas();
      }
    };

    citasContainer.appendChild(citaDiv);
  });
}

nuevaCitaBtn.onclick = () => {
  mostrarModal();
};

cancelarBtn.onclick = cerrarModal;

citaForm.onsubmit = (e) => {
  e.preventDefault();
  const nuevaCita = {
    nombre: nombreInput.value,
    fecha: fechaInput.value,
    hora: horaInput.value,
    motivo: motivoInput.value,
    hecha: false
  };

  if (editandoIndex !== null) {
    citas[editandoIndex] = { ...citas[editandoIndex], ...nuevaCita };
  } else {
    citas.push(nuevaCita);
  }
  cerrarModal();
  renderCitas();
};

window.onclick = (e) => {
  if (e.target == citaModal) {
    cerrarModal();
  }
};
document.getElementById("citaForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value;

  const creada_por = 1; 

  fetch("../php/crear_citas.php", { //Formulario para guardar citas
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ //Convierte a JSON
      nombre,
      fecha,
      hora,
      motivo,
      creada_por
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Cita guardada exitosamente.");
      document.getElementById("citaForm").reset();
      document.getElementById("citaModal").style.display = "none";
      
    } else {
      alert("Error al guardar la cita: " + data.error);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Error al conectar con el servidor.");
  });
});

renderCitas();
  function marcarDiasConCitas() {
    const fechasConCita = new Set(citas.map(c => c.fecha));
    
    const calendarioDias = document.querySelectorAll('.datepicker-cell.day');
    calendarioDias.forEach(dia => {
      const fecha = dia.getAttribute('data-date');
      if (!fecha) return;

      const fechaFormateada = new Date(parseInt(fecha)).toISOString().split('T')[0];

      if (fechaFormateada === new Date().toISOString().split('T')[0]) {
        dia.classList.add('hoy');
      }

      if (fechasConCita.has(fechaFormateada)) {
        dia.classList.add('con-cita');
      }
    });
  }

  inputCalendario.addEventListener('changeDate', (e) => {
    const fechaSeleccionada = e.detail.date.toISOString().split('T')[0];

    const citasDeEseDia = citas.filter(c => c.fecha === fechaSeleccionada);
    const contenedor = document.getElementById('infoFechaSeleccionada');

    contenedor.innerHTML = `<h3>Citas del ${fechaSeleccionada}</h3>`;
    if (citasDeEseDia.length === 0) {
      contenedor.innerHTML += `<p>No hay citas programadas.</p>`;
    } else {
      citasDeEseDia.forEach(cita => {
        contenedor.innerHTML += `
          <div class="cita">
            <div>
              <strong>${cita.nombre}</strong><br>
              ${cita.hora} - ${cita.motivo}
            </div>
          </div>
        `;
      });
    }
  });
  // Vuelve a marcar los días cada vez que el calendario se muestra
  inputCalendario.addEventListener('show', () => {
    setTimeout(marcarDiasConCitas, 10);
  });

  renderProductos();
});

let compras = [
  { cliente: "Ana Pérez", producto: "Proteína", cantidad: 1, fecha: "2025-05-08", enviado: false },
  { cliente: "Carlos Díaz", producto: "Vitaminas", cantidad: 2, fecha: "2025-05-07", enviado: true }
];

function renderProductos() {
  const tbody = document.querySelector("#tabla-compras tbody");
  tbody.innerHTML = "";

  compras.forEach((compra, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${compra.cliente}</td>
      <td>${compra.producto}</td>
      <td>${compra.cantidad}</td>
      <td>${compra.fecha}</td>
      <td>${compra.enviado ? "✅ Enviado" : "❌ Pendiente"}</td>
      <td><button onclick="toggleEnvio(${index})">${compra.enviado ? "Desmarcar" : "Marcar enviado"}</button></td>
    `;

    tbody.appendChild(fila);
    
  });
}

function toggleEnvio(index) {
  compras[index].enviado = !compras[index].enviado;
  renderProductos();
}

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// FUNCIONES EXISTENTES

function actualizarTablaCompras() {
  const cuerpoTabla = document.querySelector("#tabla-compras tbody");
  cuerpoTabla.innerHTML = "";

  let totalCompra = 0;

  carrito.forEach(producto => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = producto.nombre;
    fila.appendChild(celdaNombre);

    const celdaCantidad = document.createElement("td");
    celdaCantidad.textContent = producto.cantidad;
    fila.appendChild(celdaCantidad);

    const celdaSubtotal = document.createElement("td");
    const subtotal = producto.precio * producto.cantidad;
    totalCompra += subtotal;
    celdaSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    fila.appendChild(celdaSubtotal);

    const celdaEliminar = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      eliminarDelCarrito(producto.nombre);
    });
    celdaEliminar.appendChild(botonEliminar);
    fila.appendChild(celdaEliminar);

    cuerpoTabla.appendChild(fila);
  });

  document.getElementById("total-compra").textContent = totalCompra.toFixed(2);
}

function eliminarDelCarrito(nombreProducto) {
  carrito = carrito.filter(producto => producto.nombre !== nombreProducto);
  actualizarTablaCompras();
  guardarCarritoEnLocalStorage();
}

// FUNCIONES NUEVAS PARA NOTIFICACIÓN
function marcarNuevaNotificacion() {
  document.getElementById("notificacion").style.display = "inline-block";
}

function limpiarNotificacion() {
  document.getElementById("notificacion").style.display = "none";
}
// Simulación de llegada de nueva notificación tras 3 segundos
setTimeout(() => {
  marcarNuevaNotificacion();

  // Ocultar la notificación automáticamente después de 5 segundos
  setTimeout(limpiarNotificacion, 5000);
}, 3000);
document.getElementById("logout-btn").addEventListener("click", () => {
  // Eliminar datos del login (si usas localStorage o similar)
  localStorage.removeItem("usuarioLogueado"); // o el nombre que uses
  // Redirigir al login
  window.location.href = "../login.html"; // cambia esto si usas otro archivo
});
