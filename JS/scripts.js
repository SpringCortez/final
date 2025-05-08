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




// Carrusel DE IMAGENES
let currentSlide = 0;
const heroCarousel = document.querySelector('.hero-carrusel');
const slides = document.querySelectorAll('.hero-carrusel .slide');
const totalSlides = slides.length;
const indicators = document.querySelectorAll('.indicador'); 

function showSlide(index) {
  // Mover el carrusel
  heroCarousel.style.transform = `translateX(-${index * 100}%)`;

  // Actualizar clases de active
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });

  currentSlide = index;
}

// Cambio automático cada 5 segundos
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}, 5000);

// Swipe en celulares
let touchStartX = 0;
let touchEndX = 0;

heroCarousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

heroCarousel.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) { 
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }
  if (touchEndX > touchStartX + 50) { 
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }
}

// Clic en los puntitos
indicators.forEach((indicator, i) => {
  indicator.addEventListener('click', () => {
    showSlide(i);
  });
});

// Click en slides para redirigir
slides.forEach(slide => {
  slide.addEventListener('click', () => {
    const link = slide.getAttribute('data-link');
    if (link) {
      window.location.href = link;
    }
  });
});
//CARRUSEL TESTIMONIOS

const testimonios = document.querySelectorAll('.testimonio');
let indiceActual = 0;

function mostrarSiguienteTestimonio() {
  testimonios[indiceActual].classList.remove('activo');
  indiceActual = (indiceActual + 1) % testimonios.length;
  testimonios[indiceActual].classList.add('activo');
}

// Cambiar cada 5 segundos (5000ms)
setInterval(mostrarSiguienteTestimonio, 5000);


//CARRUSEL FRASES
const frases = [
'"Cuida tu cuerpo, es el único lugar que tienes para vivir."',
'"El primer paso hacia el bienestar es una buena nutrición."',
'"Pequeños cambios, grandes resultados."'
];
     
   let indexFrase = 0;
     const fraseElemento = document.getElementById('frase-motivadora');
   
   setInterval(() => {
       indexFrase = (indexFrase + 1) % frases.length;
       fraseElemento.style.opacity = 0;
       setTimeout(() => {
         fraseElemento.textContent = frases[indexFrase];
         fraseElemento.style.opacity = 1;
       }, 500);
   }, 4000); // Cambia cada 4 segundos
   
   