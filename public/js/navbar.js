function gerarVisitanteID() {
    if (!sessionStorage.getItem("VISITOR_ID")) {
        sessionStorage.setItem("VISITOR_ID", "visitor_" + Date.now());
    }
}

function navbar() {
    gerarVisitanteID();

    const itens = [
        "misticismo",
        "simbologias",
        "literatura",
        "gastronomia",
        "quiz",
        "login"
    ];

    itens.forEach(item => {
        const elemento = document.getElementById(item);
        if (!elemento) return; 

        if (sessionStorage.getItem(`${item}Desbloqueado`) === "true") {
            elemento.style.display = "block";
        } else {
            elemento.style.display = "none";
        }
    });
}

window.onload = navbar;
