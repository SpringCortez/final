window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const estado = params.get("estado");
  
    if (estado === "exito") {
      alert("Tu mensaje fue enviado correctamente.");
    } else if (estado === "error") {
      alert("Hubo un error al enviar tu mensaje. Intenta más tarde.");
    }
  });
  
  document.getElementById('btn-whatsapp').addEventListener('click', function () {
    const nombre = document.getElementById('nombre').value.trim();
    const motivo = document.getElementById('motivo')?.value.trim(); // nuevo campo
    const mensaje = document.getElementById('mensaje').value.trim();
  
    if (!nombre || !mensaje || !motivo) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }
  
    const numero = '526567788927'; // asegúrate de no incluir signos ni espacios
    const texto = `Hola, soy ${nombre}. Motivo: ${motivo}. ${mensaje}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    this.href = url;
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
