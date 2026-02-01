// FORMULARIO
document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("¡Gracias por contactarnos! 😊 Pronto te responderemos.");
  this.reset();
});

// ANIMACIONES SCROLL
const elements = document.querySelectorAll(".fade");

function showOnScroll() {
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", showOnScroll);
showOnScroll();
