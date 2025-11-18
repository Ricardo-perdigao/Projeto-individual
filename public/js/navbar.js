function navbar() {

  const itens = [
    "misticismo",
    "simbologias",
    "literatura",
    "gastronomia",
    "quiz",
    "login"
  ];

  itens.forEach(id => {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    const li = elemento.parentElement;

    if (sessionStorage.getItem(id + "Desbloqueado") === "true") {
      elemento.style.display = "block";
      li.style.display = "list-item";
    }
  });

}

window.onload = navbar;
