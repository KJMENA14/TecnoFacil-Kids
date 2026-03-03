import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


console.log(adminBtn);
console.log(adminPanel);
console.log(cerrarBtn);
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

});