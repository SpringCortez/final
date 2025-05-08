document.addEventListener("DOMContentLoaded", () => {
  const resumen = document.getElementById("carrito-resumen");
  const totalTexto = document.getElementById("total");

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let total = 0;

  if (carrito.length === 0) {
    resumen.innerHTML = "<p>Tu carrito está vacío.</p>";
  } else {
    carrito.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item");
      div.innerHTML = `
        <span>${item.nombre} x${item.cantidad}</span>
        <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
      `;
      resumen.appendChild(div);
      total += item.precio * item.cantidad;
    });
    totalTexto.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem("cartTotal", total.toFixed(2));
  }

  // Inicializar botón de PayPal
  const monto = localStorage.getItem("cartTotal") || "0.00";

  paypal.Buttons({
    style: {
      color: 'blue',
      shape: 'pill',
      label: 'pay'
    },
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: monto
          },
          description: "Pago por retos nutricionales"
        }]
      });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          const nombreFormulario = document.querySelector('input[name="nombre"]').value;
          const correoFormulario = document.querySelector('input[name="email"]').value;
      
          console.log("Nombre en PayPal:", details.payer.name.given_name);
          console.log("Correo en PayPal:", details.payer.email_address);
      
          // Aquí podrías validar o guardar los datos
          alert(`Gracias por tu pago, ${nombreFormulario}. Hemos recibido tu compra.`);
          
          localStorage.removeItem("carrito");
          localStorage.removeItem("cartTotal");
          window.location.href = "gracias.html";
        });
      },onCancel: function () {
      alert('Pago cancelado.');
    },
    onError: function (err) {
      console.error('Error durante el pago:', err);
      alert('Ocurrió un error durante el pago.');
    }
  }).render('#paypal-button-container');
});

const datos = {
    nombre: document.querySelector('input[name="nombre"]').value,
    email: document.querySelector('input[name="email"]').value,
    notas: document.querySelector('textarea[name="notas"]').value,
    total: total.toFixed(2),
    carrito: carrito // El mismo que cargaste del localStorage
  };
  
  fetch("guardar_pedido.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(respuesta => {
    if (respuesta.status === "ok") {
      window.location.href = "gracias.html";
    } else {
      alert("Error al guardar el pedido: " + respuesta.msg);
    }
  });
  
