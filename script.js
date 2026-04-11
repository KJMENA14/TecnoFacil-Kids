import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCJowJAlY5PX-faTwfKzO3pwuHCquNmsfY",
  authDomain: "tecnofacilkids.firebaseapp.com",
  projectId: "tecnofacilkids",
  storageBucket: "tecnofacilkids.firebasestorage.app",
  messagingSenderId: "1062928837925",
  appId: "1:1062928837925:web:a38ff55bec31ada3057ecc"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ESPERAR QUE CARGUE EL HTML
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // FORMULARIO
  // =========================
  const form = document.getElementById("formulario");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contactos"), {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        mensaje: document.getElementById("mensaje").value,
        fecha: new Date()
      });

      alert("Mensaje enviado correctamente 🚀");
      form.reset();

    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar mensaje ❌");
    }
  });

  // =========================
// COMPRAS
// =========================
let paqueteSeleccionado = "";

const modal = document.getElementById("modalCompra");
const cerrarModal = document.getElementById("cerrarModal");
const confirmarCompra = document.getElementById("confirmarCompra");

const botonesComprar = document.querySelectorAll(".comprar");

botonesComprar.forEach(btn => {
  btn.addEventListener("click", () => {
    paqueteSeleccionado = btn.dataset.paquete;
    modal.style.display = "flex";
  });
});

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

confirmarCompra.addEventListener("click", async () => {

  const nombre = document.getElementById("modalNombre").value;
  const correo = document.getElementById("modalCorreo").value;

  if (!nombre || !correo) {
    alert("Completa los datos ❌");
    return;
  }

  try {
    await addDoc(collection(db, "compras"), {
      nombre,
      correo,
      paquete: paqueteSeleccionado,
      estado: "pendiente",
      fecha: new Date()
    });

    mostrarToast("Compra registrada 🎉");
    modal.style.display = "none";

    // limpiar inputs (pro)
    document.getElementById("modalNombre").value = "";
    document.getElementById("modalCorreo").value = "";

  } catch (error) {
    alert("Error ❌");
  }
});
  // =========================
  // PANEL ADMIN
  // =========================
  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const cerrarBtn = document.getElementById("cerrarBtn");

  const passwordAdmin = "1234";

  adminBtn.addEventListener("click", async () => {
    const password = prompt("Ingrese contraseña de administrador:");

    if (password === passwordAdmin) {
      adminPanel.style.display = "block";
      mostrarMensajes();
      mostrarCompras();
    } else {
      alert("Contraseña incorrecta ❌");
    }
  });

  cerrarBtn.addEventListener("click", () => {
    adminPanel.style.display = "none";
  });

  async function mostrarMensajes() {
    const contenedor = document.getElementById("listaMensajes");
    contenedor.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "contactos"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      contenedor.innerHTML += `
        <div style="background:white; padding:15px; margin:10px; border-radius:10px;">
          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Correo:</strong> ${data.correo}</p>
          <p><strong>Mensaje:</strong> ${data.mensaje}</p>
          <hr>
        </div>
      `;
    });
  }

 async function mostrarCompras() {
  const contenedor = document.getElementById("listaCompras");
  contenedor.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "compras"));

  querySnapshot.forEach((documento) => {
    const data = documento.data();

    contenedor.innerHTML += `
      <div style="background:#fff; padding:15px; margin:10px; border-radius:10px;">
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Correo:</strong> ${data.correo}</p>
        <p><strong>Paquete:</strong> ${data.paquete}</p>
        <p><strong>Estado:</strong> 
          <span style="
            padding:5px 10px;
            border-radius:10px;
            color:white;
            background:${data.estado === 'pagado' ? 'green' : 'orange'};
          ">
            ${data.estado}
          </span>
        </p>
        <button onclick="cambiarEstado('${documento.id}', 'pagado')">Marcar pagado</button>
        <button onclick="cambiarEstado('${documento.id}', 'pendiente')">Pendiente</button>

        <hr>
      </div>
    `;
  });
}

});

window.cambiarEstado = async (id, nuevoEstado) => {
  try {
    const ref = doc(db, "compras", id);
    await updateDoc(ref, {
      estado: nuevoEstado
    });

    mostrarToast("Estado actualizado ✅");
    mostrarCompras();

  } catch (error) {
    console.error(error);
    alert("Error al actualizar ❌");
  }
};

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}