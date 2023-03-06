var cidades = [];
var estados = [];

const ufEstados = [
  { uf: "AC", estado: "Acre" },
  { uf: "AL", estado: "Alagoas" },
  { uf: "AP", estado: "Amapa" },
  { uf: "AM", estado: "Amazonas" },
  { uf: "BA", estado: "Bahia" },
  { uf: "CE", estado: "Ceara" },
  { uf: "DF", estado: "Distrito Federal" },
  { uf: "ES", estado: "Espirito Santo" },
  { uf: "GO", estado: "Goias" },
  { uf: "MA", estado: "Maranhao" },
  { uf: "MT", estado: "Mato Grosso" },
  { uf: "MS", estado: "Mato Grosso do Sul" },
  { uf: "MG", estado: "Minas Gerais" },
  { uf: "PA", estado: "Para" },
  { uf: "PB", estado: "Paraiba" },
  { uf: "PR", estado: "Parana" },
  { uf: "PE", estado: "Pernambuco" },
  { uf: "PI", estado: "Piaui" },
  { uf: "RJ", estado: "Rio de Janeiro" },
  { uf: "RN", estado: "Rio Grande do Norte" },
  { uf: "RS", estado: "Rio Grande do Sul" },
  { uf: "RO", estado: "Rondonia" },
  { uf: "RR", estado: "Roraima" },
  { uf: "SC", estado: "Santa Catarina" },
  { uf: "SP", estado: "Sao Paulo" },
  { uf: "SE", estado: "Sergipe" },
  { uf: "TO", estado: "Tocantins" },
];

async function pesquisarCep(cepID) {
  let cep = document.getElementById(cepID).value;
  var validacep = /^[0-9]{8}$/;
  if (!validacep.test(cep)) {
    // document.getElementById('resposta').innerHTML = `<h5>Formato do CEP inválido</h5>`
    alert("Formato do CEP inválido");
    return;
  } else {
    await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((conteudo) => {
        const cardTitle = cepID === "cep-origem" ? "Origem" : "Destino";

        if ("erro" in conteudo) {
          document.getElementById(
            "resposta"
          ).innerHTML = `<div class="card-container">
            <div class="card-title">
              <h5>${cardTitle}</h5>
            </div>
            <div class="card-separator"></div>
            <div class="card-content cep-not-found">
              <p>
                <strong>CEP não encontrado</strong>
              </p>
            </div>
          </div>`;
        } else {
          cidades.unshift(conteudo.localidade);
          estados.unshift(conteudo.uf);
          document.getElementById(
            "resposta"
          ).innerHTML += `<div class="card-container cepCard">
            <div class="card-title">
              <h5>${cardTitle}</h5>
            </div>
            <div class="card-separator"></div>
            <div class="card-content">
              <p>
                <strong>CEP:</strong>
                <span>${conteudo.cep}</span>
              </p>
              <p>
                <strong>Logradouro:</strong>
                <span>${conteudo.logradouro}</span>
              </p>
              <p>
                <strong>Localidade:</strong>
                <span>${conteudo.localidade}</span>
              </p>
              <p>
                <strong>UF:</strong>
                <span>${conteudo.uf}</span>
              </p>
              <small>A TruckLog atende na sua região</small>
            </div>
          </div>`;
        }
      });
  }
}

const dispararPesquisaCeps = () => {
  limparPesquisaCeps();
  pesquisarCep("cep-origem");
  pesquisarCep("cep-destino");
};

const limparPesquisaCeps = () => {
  document.getElementById("resposta").innerHTML = "";
  estados = [];
  cidades = [];
};

async function calcularFrete() {
  let peso = document.getElementById("peso").value;

  if (peso == 0) {
    alert("Peso da carga tem que ser maior que 0");
    return;
  }

  if (document.querySelectorAll(".cepCard").length !== 2) {
    await dispararPesquisaCeps();
    alert("Calcule novamente o frete");
    return;
  }

  if (!(estados.length == 2) && estados.length == 2) {
    alert("Preencha os dois CEPs válidos");
    return;
  }

  let calculosElements = document.querySelectorAll(".frete-calculado");
  for (let i = 0; i < calculosElements.length; i++) {
    calculosElements[i].remove();
  }

  let estadoOrigem = ufEstados.map(function (element) {
    if (element.uf === estados[0]) {
      return element.estado;
    }
  });

  let estadoDestino = ufEstados.map(function (element) {
    if (element.uf === estados[1]) {
      return element.estado;
    }
  });

  let origem = cidades[0] + "," + estadoOrigem;
  let destino = cidades[1] + "," + estadoDestino;
  console.log(origem);
  console.log(destino);

  await fetch(
    `https://dev.virtualearth.net/REST/v1/Routes?wp.0=${origem}&wp.1=${destino}&key=AjhiccnPfgp0nSj_Cs-kKMMB74LWNPDpiwNiRrjM6LTkClBkpGfffR3AvGq0MGdG`,
    {
      method: "GET",
      headers: {
        // 'Content-Type': 'application/json'
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((conteudo) => {
      if (peso === "0" || peso === "") {
        alert("Peso da carga tem que ser maior que 0");
        return;
      } else {
        let distancia = conteudo.resourceSets[0].resources[0].travelDistance;
        let peso = document.getElementById("peso").value;
        let valorFrete = distancia * peso * 2;
        var valorFormatado = valorFrete.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
        document.getElementById(
          "resposta"
        ).innerHTML += `<div class="card-container">
            <div class="card-title">
              <h5>Simulação</h5>
            </div>
            <div class="card-separator"></div>
            <div class="card-content">
              <p>
                <strong>Distância:</strong>
                <span>${parseInt(distancia)} km</span>
              </p>
              <p>
                <strong>Total:</strong>
                <span>${valorFormatado}</span>
              </p>
            </div>
          </div>`;
      }
    });

  document.querySelector("#peso").value = "";
  document.querySelector("#cep-origem").value = "";
  document.querySelector("#cep-destino").value = "";
}
