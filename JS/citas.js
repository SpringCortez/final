document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const horariosEl = document.getElementById('horarios');
  const fechaTexto = document.getElementById('fecha-seleccionada');
  const contenedorHorarios = document.getElementById('contenedor-horarios');

  const horasBase = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:30"];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    validRange: function (nowDate) {
      return { start: nowDate }; // Bloquear días pasados
    },
    events: [],
dateClick: function (info) {
  const fecha = info.dateStr;
  const hoy = new Date().toISOString().split("T")[0];

  if (fecha < hoy) {
    alert("No puedes seleccionar una fecha pasada.");
    return;
  }

  fechaTexto.textContent = `Horarios disponibles para ${fecha}`;
  horariosEl.style.display = 'block';

  fetch('php/obtener_citas.php')
    .then(response => response.json())
    .then(citas => {
      const horasBase = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:30"];
      contenedorHorarios.innerHTML = '';

      horasBase.forEach(hora => {
        const boton = document.createElement('button');
        boton.textContent = hora;

        const ocupado = citas.some(cita => cita.fecha === fecha && cita.hora === hora);

        if (ocupado) {
          boton.disabled = true;
          boton.classList.add('rojo');
        } else {
          boton.classList.add('verde');
          boton.addEventListener('click', () => {
            // Elimina botón previo si existía
            const botonExistente = document.getElementById('boton-reserva');
            if (botonExistente) botonExistente.remove();

            const botonReserva = document.createElement('a');
            botonReserva.id = 'boton-reserva';
            botonReserva.href = `contacto.html?fecha=${fecha}&hora=${hora}`;
            botonReserva.textContent = `Reservar para el ${fecha} a las ${hora}`;
            botonReserva.classList.add('boton-confirmar');

            // Estilos opcionales para el botón de confirmación
            botonReserva.style.display = 'block';
            botonReserva.style.marginTop = '15px';

            contenedorHorarios.appendChild(botonReserva);
          });
        }

        contenedorHorarios.appendChild(boton);
      });
    });
}

  });

  // Cargar colores dinámicos para los días según las citas
  fetch('php/obtener_citas.php')
    .then(response => response.json())
    .then(citas => {
      const citasPorFecha = {};

      citas.forEach(cita => {
        if (!citasPorFecha[cita.fecha]) {
          citasPorFecha[cita.fecha] = 0;
        }
        citasPorFecha[cita.fecha]++;
      });

      Object.entries(citasPorFecha).forEach(([fecha, cantidad]) => {
        let color;
        if (cantidad === 0) {
          color = 'green';
        } else if (cantidad < horasBase.length) {
          color = 'yellow';
        } else {
          color = 'red';
        }

        calendar.addEvent({
          title: '',
          start: fecha,
          color: color
        });
      });

      // Pintar de verde los días disponibles sin citas
      const fechasExistentes = new Set(Object.keys(citasPorFecha));
      const hoy = new Date();
      const diasAdelante = 60;

      for (let i = 0; i < diasAdelante; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const fechaStr = fecha.toISOString().split("T")[0];

        if (!fechasExistentes.has(fechaStr)) {
          calendar.addEvent({
            title: '',
            start: fechaStr,
            color: 'green'
          });
        }
      }

      calendar.render();
    });

  // MENU HAMBURGUESA
  const menuHamburguesa = document.getElementById('menu-menu-hamburguesa');
  const navLinks = document.querySelector('.nav-links');
  const enlaces = document.querySelectorAll('.nav-links a');

  menuHamburguesa.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuHamburguesa.classList.toggle('active');
  });

  enlaces.forEach(enlace => {
    enlace.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuHamburguesa.classList.remove('active');
    });
  });
});
