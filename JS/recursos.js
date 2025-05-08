document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.toggle-receta');

  botones.forEach(boton => {
    // Guarda el texto original en un atributo data
    boton.dataset.original = boton.textContent.trim();

    boton.addEventListener('click', () => {
      const detalleActual = boton.closest('.receta').querySelector('.receta-detalle');

      // Cerrar otras recetas abiertas
      document.querySelectorAll('.receta-detalle.mostrar').forEach(detalle => {
        if (detalle !== detalleActual) {
          detalle.classList.remove('mostrar');

          const otroBoton = detalle.closest('.receta').querySelector('.toggle-receta');
          if (otroBoton) {
            otroBoton.textContent = otroBoton.dataset.original;
          }
        }
      });

      // Toggle de la receta actual
      const estaAbierta = detalleActual.classList.contains('mostrar');
      detalleActual.classList.toggle('mostrar');

      // Cambiar el texto del botón actual
      boton.textContent = estaAbierta ? boton.dataset.original : 'Ocultar receta';
    });
  });
});
