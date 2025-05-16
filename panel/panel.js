
document.addEventListener("DOMContentLoaded", () => {
  const secciones = {
    "Citas": document.getElementById("contenidoPrincipal"),
    "Productos": document.getElementById("seccion-productos"),
    "Configuración": document.getElementById("seccion-configuracion")
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
fetch("../php/obtener_citas.php")
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
    const cita = citas[index];
    
    fetch("../php/eliminar_cita.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: cita.id })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        citas.splice(index, 1);
        renderCitas();
        alert("Cita eliminada correctamente.");
      } else {
        alert("Error al eliminar la cita: " + data.error);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    });
  }
};
    citasContainer.appendChild(citaDiv);
  });
}

nuevaCitaBtn.onclick = () => {
  mostrarModal();
};

cancelarBtn.onclick = cerrarModal;

citaForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = nombreInput.value;
  const fecha = fechaInput.value;
  const hora = horaInput.value;
  const motivo = motivoInput.value;

  if (editandoIndex !== null) {
    const cita = citas[editandoIndex];

    fetch("../php/editar_citas.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: cita.id,
        nombre,
        fecha,
        hora,
        motivo,
        creada_por: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Cita editada exitosamente.");
        citas[editandoIndex] = { ...cita, nombre, fecha, hora, motivo };
        cerrarModal();
        renderCitas();
      } else {
        alert("Error al editar la cita: " + data.error);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    });

  } else {
    // Crear nueva cita
    fetch("../php/crear_citas.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        fecha,
        hora,
        motivo,
        creada_por: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Cita guardada exitosamente.");
        cerrarModal(); 
        citas.push({ id: data.id, nombre, fecha, hora, motivo, hecha: false });
        renderCitas();
      } else {
        alert("Error al guardar la cita: " + data.error);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    });
  }
});



window.onclick = (e) => {
  if (e.target == citaModal) {
    cerrarModal();
  }
};

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

  obtenerComprasDesdeServidor();
  renderProductos();
  renderConfiguracion();
});

let compras = [];

function obtenerComprasDesdeServidor() {
  fetch("../php/obtener_compras.php")
    .then(res => res.json())
    .then(data => {
      compras = data;
      renderProductos();
    })
    .catch(err => {
      console.error("Error al obtener compras:", err);
    });
}


function renderProductos() {
  const tbody = document.querySelector("#tabla-compras tbody");
  tbody.innerHTML = "";

  compras.forEach((compra, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${compras.cliente}</td>
      <td>${compras.producto}</td>
      <td>${compras.cantidad}</td>
      <td>${compras.fecha}</td>
      <td>${compras.enviado ? "✅ Enviado" : "❌ Pendiente"}</td>
      <td><button onclick="toggleEnvio(${index})">${compra.enviado ? "Desmarcar" : "Marcar enviado"}</button></td>
    `;

    tbody.appendChild(fila);
    
  });
}

function toggleEnvio(index) {
  const compra = compras[index];
  const nuevoEstado = !compra.enviado;

  fetch("../php/actualizar_envio.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: compra.id,
      enviado: nuevoEstado
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        compras[index].enviado = nuevoEstado;
        renderProductos();
      } else {
        alert("Error al actualizar el estado.");
      }
    })
    .catch(err => {
      console.error("Error de red:", err);
    });
}

function renderConfiguracion() {
  const contenedor = document.getElementById("seccion-configuracion");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  const tarjetas = [
    {
      titulo: "Productos",
      descripcion: "Administra los productos disponibles en la tienda.",
      botonTexto: "Administrar Productos",
      onClick: mostrarAdminProductos
    },
    {
      titulo: "Sobre mí",
      descripcion: "Edita tu información personal y profesional.",
      botonTexto: "Editar Perfil",
      onClick: mostrarSobreMi
    }
  ];

  tarjetas.forEach(tarjeta => {
    const div = document.createElement("div");
    div.className = "tarjeta-configuracion";

    div.innerHTML = `
      <h3>${tarjeta.titulo}</h3>
      <p>${tarjeta.descripcion}</p>
      <button>${tarjeta.botonTexto}</button>
    `;

    const boton = div.querySelector("button");
    boton.addEventListener("click", tarjeta.onClick);

    contenedor.appendChild(div);
  });
}

function mostrarSobreMi() {
  document.getElementById("seccion-configuracion").style.display = "none";
  document.getElementById("seccion-admin-productos").style.display = "none";
  document.getElementById("seccion-sobre-mi").style.display = "block";
  obtenerDatosSobreMi();
}

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

document.getElementById("btn-configuracion").addEventListener("click", () => {
  document.getElementById("contenidoPrincipal").style.display = "none";
  document.getElementById("seccion-productos").style.display = "none";
  document.getElementById("seccion-configuracion").style.display = "block";
  document.getElementById("seccion-sobre-mi").style.display = 'none'; // ✔ oculto hasta que se llame mostrarSobreMi
  renderConfiguracion();
});


function mostrarConfiguracion() {
  document.getElementById("seccion-configuracion").style.display = "block";
  document.getElementById("seccion-admin-productos").style.display = "none";
  document.getElementById("seccion-sobre-mi").style.display = "none";
  obtenerDatosSobreMi();
}

function obtenerDatosSobreMi() {
  fetch("../php/obtener_sobremi.php")
    .then(response => response.json())
    .then(data => {
      console.log("Datos recibidos de sobre mí:", data);
      const contenedor = document.getElementById("seccion-sobre-mi");
      contenedor.innerHTML = `
        <button onclick="mostrarConfiguracion()">⬅ Volver</button>
        <h2>Editar Perfil</h2>
        <div class="tarjeta-configuracion">
          <h3>${data.titulo}</h3>
          <p>${data.descripcion}</p>
          <img src="${data.imagen}" alt="Imagen" style="max-width: 200px; display: block; margin-top: 10px;">
          <button onclick="mostrarFormularioEditarSobreMi(
          ${data.id},
          ${JSON.stringify(data.titulo)},
          ${JSON.stringify(data.descripcion)},
          ${JSON.stringify(data.imagen)}
          )">Editar</button>
        </div>
      `;
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
    });
}

function mostrarFormularioEditarSobreMi(id, titulo, descripcion, imagen) {
  const modal = document.getElementById("modal-sobre-mi");
  modal.style.display = "block";
  document.getElementById("id-sobre-mi").value = id;
  document.getElementById("titulo-sobre-mi").value = titulo;
  document.getElementById("descripcion-sobre-mi").value = descripcion;
  document.getElementById("imagen-sobre-mi").src = imagen;
  
const form = document.getElementById("form-sobre-mi");
form.onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  fetch("../php/actualizar_sobremi.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .then(respuesta => {
      console.log("Respuesta del servidor:", respuesta);
      document.getElementById("modal-sobre-mi").style.display = "none";
      obtenerDatosSobreMi();
    })
    .catch(err => console.error("Error al actualizar:", err));
};

}


function mostrarAdminProductos() {
  document.getElementById("seccion-configuracion").style.display = "none";
  document.getElementById("seccion-sobre-mi").style.display = "none";
  document.getElementById("seccion-admin-productos").style.display = "block";
}

function mostrarFormularioProducto() {
  document.getElementById("formulario-producto").style.display = "block";
  document.getElementById("productoForm").reset();
  document.getElementById("producto-id").value = "";
}

function cancelarFormularioProducto() {
  document.getElementById("formulario-producto").style.display = "none";
}

function editarProducto(id) {
  window.location.href = `../php/editar_producto.php?id=${id}`;
}


function eliminarProducto(id) {
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    window.location.href = `../php/eliminar_producto.php?id=${id}`;
  }
}

function filtrarProductos() {
  const nombreFiltro = document.getElementById('busqueda-nombre').value.toLowerCase();
  const precioFiltro = document.getElementById('busqueda-precio').value;

  document.querySelectorAll('#seccion-productos tbody tr').forEach((fila) => {
    const nombre = fila.children[1].textContent.toLowerCase();
    const precio = fila.children[2].textContent.replace('$', '').trim();

    const coincideNombre = nombre.includes(nombreFiltro);
    const coincidePrecio = precioFiltro ? parseFloat(precio) === parseFloat(precioFiltro) : true;

    fila.style.display = coincideNombre && coincidePrecio ? '' : 'none';
  });
}

function resetearFiltros() {
  document.getElementById('busqueda-nombre').value = '';
  document.getElementById('busqueda-precio').value = '';
  filtrarProductos(); // Vuelve a mostrar todo
}

function ordenarPorNombre() {
  ordenarTabla(1, 'string'); // Columna 1 = Nombre
}

function ordenarPorPrecio() {
  ordenarTabla(2, 'number'); // Columna 2 = Precio
}

function ordenarTabla(indiceColumna, tipo) {
  const tbody = document.querySelector('#seccion-productos tbody');
  const filas = Array.from(tbody.querySelectorAll('tr'));

  filas.sort((a, b) => {
    let valA = a.children[indiceColumna].textContent.trim();
    let valB = b.children[indiceColumna].textContent.trim();

    if (tipo === 'number') {
      valA = parseFloat(valA.replace('$', ''));
      valB = parseFloat(valB.replace('$', ''));
    } else {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    return valA > valB ? 1 : valA < valB ? -1 : 0;
  });

  // Vuelve a insertar las filas ordenadas
  filas.forEach(fila => tbody.appendChild(fila));
}


function marcarNuevaNotificacion() {
  document.getElementById("notificacion").style.display = "inline-block";
}

function limpiarNotificacion() {
  document.getElementById("notificacion").style.display = "none";
}

// Consultar al backend si hay novedades reales
function verificarNovedades() {
  fetch("../php/novedades.php")
    .then(res => res.json())
    .then(data => {
      if (data.hayNovedades) {
        marcarNuevaNotificacion();
      } else {
        limpiarNotificacion();
      }
    })
    .catch(err => {
      console.error("Error al verificar novedades:", err);
    });
}

// Llamar una sola vez al cargar
document.addEventListener("DOMContentLoaded", () => {
  verificarNovedades();
});

// Botón logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "../login.html";
});

