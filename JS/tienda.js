let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function mostrarSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function moverCarrusel(direccion) {
  slideIndex = (slideIndex + direccion + slides.length) % slides.length;
  mostrarSlide(slideIndex);
}

// Auto cambio de slides cada 5 segundos
setInterval(() => {
  moverCarrusel(1);
}, 5000);

// Mostrar el primer slide al cargar
mostrarSlide(slideIndex);


let carrito = [];

// Leer del localStorage al iniciar
window.addEventListener('DOMContentLoaded', () => {
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    carrito = JSON.parse(guardado);
    actualizarCarrito();
  }
});

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
  const item = carrito.find(p => p.nombre === nombre);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarrito();
  guardarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalSpan = document.getElementById('total');
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <strong>${item.nombre}</strong><br>
      Cantidad: 
      <button onclick="cambiarCantidad(${index}, -1)">−</button>
      <span>${item.cantidad}</span>
      <button onclick="cambiarCantidad(${index}, 1)">+</button>
      <br>
      Subtotal: $${item.precio * item.cantidad}
      <br>
      <button onclick="eliminarProducto(${index})">❌ Quitar</button>
    `;

    lista.appendChild(li);
    total += item.precio * item.cantidad;
  });

  totalSpan.textContent = total;
  guardarCarrito(); // <- Nos aseguramos de guardar en cada actualización
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function mostrarCarrito() {
  document.getElementById('carrito').classList.remove('hidden');
}

function cerrarCarrito() {
  document.getElementById('carrito').classList.add('hidden');
}
