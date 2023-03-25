// Inicialização de variáveis
const tabela = document.querySelector("#tabela-repertorio tbody");
const formMusica = document.querySelector("#form-musica");
const compartilharBtn = document.querySelector("#compartilhar");
let repertorio = [];

// Carregar dados do localStorage
function carregarLocalStorage() {
  const dados = localStorage.getItem("repertorio");
  if (dados) {
    repertorio = JSON.parse(dados);
    repertorio.forEach(function (musica) {
      const linha = tabela.insertRow();
      linha.innerHTML = `
        <td>${musica.musica}</td>
        <td>${musica.tonalidade}</td>
        <td>${musica.artista}</td>
        <td>
          <a href="${musica.linkMusica}" target="_blank">Ouvir</a>
          <a href="${musica.linkCifra}" target="_blank">Cifra</a>
          <button class="btn-editar" data-indice="${repertorio.indexOf(musica)}">Editar</button>
          <button class="btn-excluir" data-indice="${repertorio.indexOf(musica)}">Excluir</button>
        </td>
      `;
    });
  }
}

// Salvar dados no localStorage
function atualizarLocalStorage() {
  localStorage.setItem("repertorio", JSON.stringify(repertorio));
}

// Adicionar música à tabela e ao array repertorio
function adicionarMusica(musica, tonalidade, artista, linkMusica, linkCifra) {
  const musicaObj = { musica, tonalidade, artista, linkMusica, linkCifra };
  repertorio.push(musicaObj);
  const indice = repertorio.indexOf(musicaObj);
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${musica}</td>
    <td>${tonalidade}</td>
    <td>${artista}</td>
    <td>
      <a href="${linkMusica}" target="_blank">Ouvir</a>
      <a href="${linkCifra}" target="_blank">Cifra</a>
      <button class="btn-editar" data-indice="${indice}">Editar</button>
      <button class="btn-excluir" data-indice="${indice}">Excluir</button>
    </td>
  `;
  atualizarLocalStorage();
}

// Editar música do repertório
tabela.addEventListener("click", function (event) {
  const elemento = event.target;
  if (elemento.classList.contains("btn-editar")) {
    const indice = elemento.dataset.indice;
    const musicaObj = repertorio[indice];
    document.querySelector("#nome-musica").value = musicaObj.musica;
    document.querySelector("#tonalidade-musica").value = musicaObj.tonalidade;
    document.querySelector("#artista-musica").value = musicaObj.artista;
    document.querySelector("#link-musica").value = musicaObj.linkMusica;
    document.querySelector("#link-cifra").value = musicaObj.linkCifra;
    repertorio.splice(indice, 1);
    tabela.deleteRow(indice);
    atualizarLocalStorage();
  } else if (elemento.classList.contains("btn-excluir")) {
    const indice = elemento.dataset.indice;
    repertorio.splice(indice, 1);
    tabela.deleteRow(indice);
    atualizarLocalStorage();
  }
});

// Adicionar música ao repertório
formMusica.addEventListener("submit", function (event) {
  event.preventDefault();
  const musica = document.querySelector("#nome-musica").value;
  const tonalidade = document.querySelector("#tonalidade-musica").value;
  const artista = document.querySelector("#artista-musica").value;
  const linkMusica = document.querySelector("#link-musica").value;
  const linkCifra = document.querySelector("#link-cifra").value;
  adicionarMusica(musica, tonalidade, artista, linkMusica, linkCifra);
  formMusica.reset();
});

// Compartilhar repertório no WhatsApp
compartilharBtn.addEventListener("click", function () {
  const dados = localStorage.getItem("repertorio");
  if (!dados) {
    alert("Nenhum repertório foi criado!");
    return;
  }

  const repertorio = JSON.parse(dados);
  let mensagem = "Meu repertório:\n\n";

  repertorio.forEach(function (musica) {
    mensagem += `${musica.musica} (${musica.tonalidade}) - ${musica.artista}\n`;
    mensagem += `Ouça: ${musica.linkMusica}\n`;
    mensagem += `Cifra: ${musica.linkCifra}\n\n`;
  });

  mensagem += "Compartilhado com o app criado por <seu nome>";
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
  window.open(url);
});

// Executar ao carregar a página
carregarLocalStorage();

