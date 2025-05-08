document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const horariosEl = document.getElementById('horarios');
    const fechaTexto = document.getElementById('fecha-seleccionada');
    const contenedorHorarios = document.getElementById('contenedor-horarios');

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      events: [
        { title: 'Disponible', start: '2025-05-04', color: 'green' },
        { title: 'Ocupado', start: '2025-05-05', color: 'red' }
      ],
      dateClick: function(info) {
        const fecha = info.dateStr;
        fechaTexto.textContent = `Horarios disponibles para ${fecha}`;
        horariosEl.style.display = 'block';

        const horariosEjemplo = [
          { hora: "09:00", estado: "disponible" },
          { hora: "10:00", estado: "ocupado" },
          { hora: "11:00", estado: "disponible" },
          { hora: "12:00", estado: "disponible" },
          { hora: "13:00", estado: "ocupado" },
          { hora: "14:00", estado: "disponible" }
        ];

        contenedorHorarios.innerHTML = "";

        horariosEjemplo.forEach(horario => {
          const boton = document.createElement("button");
          boton.textContent = horario.hora;
          boton.classList.add("horario", horario.estado);
          if (horario.estado === "disponible") {
            boton.classList.add("tomar");
            boton.addEventListener("click", () => {
              alert(`Seleccionaste la cita para las ${horario.hora} el día ${fecha}`);
            });
          }
          contenedorHorarios.appendChild(boton);
        });
      }
    });

    calendar.render();
  });