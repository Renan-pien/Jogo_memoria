// variáveis globais
let listaDesenhos = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb'
  ];
  let jogoIniciado = false;
  let listaCartaAberta = [];
  let contadorErros = 0;
  let contadorMovimentos = 0;
  let pista = 'procure pela sala';
  let intervalo;
  let horaInicio;
  const limiteMovimentos = 14; // Limite de movimentos
  const cronometro = document.querySelector('.cronometro');
  const movimentos = document.querySelector('.moves');
  const deck = document.querySelector('.deck');
  const restart = document.querySelector('.restart');
  const btnSim = document.querySelector('#botaoSim');
  const mensagemModal = document.querySelector('.modal-body');
  let bloqueioClique = false; // Bloqueio de clique temporário
  
  // Evento para iniciar o jogo ao clicar no botão
  document.querySelector('#botaoIniciar').addEventListener('click', function() {
    document.getElementById('tela-inicial').style.display = 'none';
    zerarJogo();  // Iniciar o jogo ao clicar no botão
  });
  
  // Evento de click nas cartas
  deck.addEventListener('click', function(event) {
    if (!jogoIniciado) {
      iniciarCronometro();
      jogoIniciado = true;
    }
    if (!bloqueioClique) { // Verifica se o clique está bloqueado
      virarCarta(event.target);
    }
  });
  
  // Evento de click no botão de reiniciar
  restart.addEventListener('click', zerarJogo);
  
  // Evento de click no botão de sim, depois de ganhar o jogo.
  btnSim.addEventListener('click', zerarJogo);
  
  // Função para embaralhar as cartas
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  
  function embaralhar() {
    listaDesenhos = shuffle(listaDesenhos);
    deck.innerHTML = "";
    for (let i = 0; i < listaDesenhos.length; i++) {
      let carta = document.createElement('li');
      carta.className = "card open show";  
      let desenho = document.createElement('i');
      desenho.className = "fa " + listaDesenhos[i];
      carta.appendChild(desenho);
      deck.appendChild(carta);
    }
    setTimeout(() => {
      let cartas = document.querySelectorAll('.card');
      cartas.forEach(carta => {
        carta.className = "card"; 
      });
    }, 2000); // Tempo para que as cartas fiquem viradas no incio do jogo
  }
  
  function virarCarta(carta) {
    if (carta.className == "card") {
      carta.className = "card open show";
      cartaAberta(carta);
    }
  }
  
  function cartaAberta(carta) {
    listaCartaAberta.push(carta);
    if (listaCartaAberta.length === 2) {
      bloqueioClique = true; // Bloqueia cliques enquanto duas cartas estão abertas
      if (listaCartaAberta[0].innerHTML === listaCartaAberta[1].innerHTML) {
        acertou();
      } else {
        setTimeout(errou, 400);
      }
      contagemMovimentos();
      verificarLimiteMovimentos();  // Verifica se atingiu o limite de movimentos
    }
  }
  
  function acertou() {
    listaCartaAberta[0].className = "card match";
    listaCartaAberta[1].className = "card match";
    listaCartaAberta = [];
    bloqueioClique = false; // Desbloqueia os cliques
    setTimeout(tudoCerto, 500);
  }
  
  function errou() {
    listaCartaAberta[0].className = "card";
    listaCartaAberta[1].className = "card";
    listaCartaAberta = [];
    bloqueioClique = false; // Desbloqueia os cliques após o erro
  }
  
  function contagemMovimentos() {
    contadorMovimentos++;
    movimentos.textContent = contadorMovimentos;
  }
  
  function verificarLimiteMovimentos() {
    if (contadorMovimentos >= limiteMovimentos) {
      fimDeJogo("Você atingiu o limite de movimentos!");
    }
  }
  
  function fimDeJogo(mensagem) {
    pararCronometro();
    mensagemModal.innerHTML = `<p>${mensagem}</p><p>Quer jogar de novo?</p>`;
    $('#modalFimDeJogo').modal({ backdrop: 'static', keyboard: false });
  }
  
  function zerarJogo() {
    embaralhar();
    contadorErros = 0;
    contadorMovimentos = 0;
    listaCartaAberta = [];
    movimentos.textContent = contadorMovimentos;
    pararCronometro();
    jogoIniciado = false;
    cronometro.innerHTML = "00:00:00";
  }
  
  function iniciarCronometro() {
    horaInicio = new Date().getTime();
    intervalo = window.setInterval(cronometrar, 1000);
  }
  
  function cronometrar() {
    let agora = new Date().getTime();
    let distancia = agora - horaInicio;
  
    let horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    let segundos = Math.floor((distancia % (1000 * 60)) / 1000);
  
    if (segundos < 10) { segundos = "0" + segundos; }
    if (minutos < 10) { minutos = "0" + minutos; }
    if (horas < 10) { horas = "0" + horas; }
  
    cronometro.innerHTML = horas + ":" + minutos + ":" + segundos;
  }
  
  function pararCronometro() {
    window.clearInterval(intervalo);
  }
  
  function tudoCerto() {
    let cartas = document.querySelectorAll('.card');
    let total = 0;
    cartas.forEach(carta => {
      if (carta.className === "card match") {
        total++;
      }
    });
  
    if (total === 16) {
      fimDeJogo(`Parabéns! Você venceu. aqui esta a sua pista: <br><strong>${pista}</strong>`);
    }
  }
  