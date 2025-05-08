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
  