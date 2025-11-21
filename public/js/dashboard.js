(function () {
  const raw = document.getElementById("rawData");
  const alerta = document.getElementById("alerta-login");

  const idUsuario = sessionStorage.ID_USUARIO || null;

  if (!idUsuario) {
    alerta.style.display = "block";
    raw.textContent = "Usuário não está logado. Faça login para acessar a dashboard.";
    return;
  }

  fetch(`/dashboard/dados/${idUsuario}`)
    .then(r => {
      if (!r.ok) throw new Error("Falha ao buscar dados da dashboard");
      return r.json();
    })
    .then(data => {
      raw.textContent = JSON.stringify(data, null, 2);

      const ctxQuiz = document.getElementById("quizChart").getContext("2d");
      const acertos = data.acertos || 0;
      const total = data.totalPerguntas || 0;
      const erros = Math.max(0, total - acertos);

      new Chart(ctxQuiz, {
        type: "pie",
        data: {
          labels: ["Acertos", "Erros"],
          datasets: [{
            data: [acertos, erros],
            backgroundColor: ["#4CAF50", "#F44336"]
          }]
        }
      });

      const ctxProg = document.getElementById("progressChart").getContext("2d");
      const labels = data.paginas && data.paginas.length ? data.paginas : ["(nenhuma)"];
      const acessos = data.acessos && data.acessos.length ? data.acessos : [0];

      new Chart(ctxProg, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Acessos",
            data: acessos
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    })
    .catch(erro => {
      console.error(erro);
      raw.textContent = "Erro ao carregar dashboard: " + erro.message;
    });
})();
