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

//MENU HAMBURGUESA
const menuHamburguesa = document.getElementById('menu-menu-hamburguesa');
const navLinks = document.querySelector('.nav-links');
const enlaces = document.querySelectorAll('.nav-links a'); // <- seleccionamos todos los links

menuHamburguesa.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuHamburguesa.classList.toggle('active');
});

// Cerramos el menú al hacer clic en un enlace
enlaces.forEach(enlace => {
  enlace.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuHamburguesa.classList.remove('active');
  });
});

