
// Elementos do formulário
const formTreino = document.getElementById("formTreino");
const tipo = document.getElementById("tipo");
const nome = document.getElementById("nome");

const camposSeries = document.getElementById("camposSeries");
const camposCardio = document.getElementById("camposCardio");

const quantidadeSeries = document.getElementById("quantidadeSeries");
const listaSeries = document.getElementById("listaSeries");
const listaTreinos = document.getElementById("listaTreinos");

// Recupera os exercícios que já foram salvos
let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

// Mostra os campos conforme o tipo escolhido
tipo.addEventListener("change", function () {
    camposSeries.style.display = "none";
    camposCardio.style.display = "none";

    listaSeries.innerHTML = "";
    quantidadeSeries.value = "";

    if (tipo.value === "musculacao" || tipo.value === "alongamento") {
        camposSeries.style.display = "flex";
    }

    if (tipo.value === "cardio") {
        camposCardio.style.display = "flex";
    }
});

// Cria os campos de cada série
quantidadeSeries.addEventListener("input", function () {
    const quantidade = Number(quantidadeSeries.value);

    listaSeries.innerHTML = "";

    if (quantidade < 1 || !Number.isInteger(quantidade) || quantidade > 50) {
        return;
    }

    for (let i = 1; i <= quantidade; i++) {
        const serie = document.createElement("div");
        serie.classList.add("serie");

        serie.innerHTML = `
            <h3>Série ${i}</h3>

            <div class="campo-serie">
                <label for="repeticoes-${i}">Repetições</label>
                <input
                    type="number"
                    id="repeticoes-${i}"
                    min="1"
                    placeholder="Ex: 12"
                    required
                >
            </div>

            <div class="campo-serie">
                <label for="carga-${i}">Carga (kg)</label>
                <input
                    type="number"
                    id="carga-${i}"
                    min="0"
                    step="0.5"
                    placeholder="Ex: 20"
                    required
                >
            </div>
        `;

        listaSeries.appendChild(serie);
    }
});

// Salva os exercícios no navegador
function salvarTreinos() {
    localStorage.setItem("treinos", JSON.stringify(treinos));
}

// Mostra os exercícios na tela
function mostrarTreinos() {
    listaTreinos.innerHTML = "";

    if (treinos.length === 0) {
        const itemVazio = document.createElement("li");
        itemVazio.classList.add("lista-vazia");

        const imagem = document.createElement("img");
        imagem.src = "assets/gym cinza.png";
        imagem.alt = "Ícone de halter";

        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum exercício registrado ainda.";

        itemVazio.appendChild(imagem);
        itemVazio.appendChild(mensagem);
        listaTreinos.appendChild(itemVazio);

        return;
    }

    treinos.forEach(function (treino) {
        const item = document.createElement("li");
        item.classList.add("item-treino");

        const titulo = document.createElement("h3");
        titulo.textContent = treino.nome;

        const categoria = document.createElement("p");
        categoria.textContent = treino.tipo;

        const detalhes = document.createElement("div");
        detalhes.classList.add("detalhes-treino");

        if (treino.tipo === "cardio") {
            detalhes.textContent = `Duração: ${treino.duracao} minutos`;

            if (treino.distancia !== "") {
                detalhes.textContent += ` | Distância: ${treino.distancia} km`;
            }
        } else {
            treino.series.forEach(function (serie, indice) {
                const linha = document.createElement("p");
                linha.textContent =
                    `Série ${indice + 1}: ${serie.repeticoes} repetições | ${serie.carga} kg`;

                detalhes.appendChild(linha);
            });
        }

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir";
        excluir.classList.add("btn-excluir");

        excluir.addEventListener("click", function () {
            treinos = treinos.filter(function (item) {
                return item.id !== treino.id;
            });

            salvarTreinos();
            mostrarTreinos();
        });

        item.appendChild(titulo);
        item.appendChild(categoria);
        item.appendChild(detalhes);
        item.appendChild(excluir);

        listaTreinos.appendChild(item);
    });
}

// Registra um novo exercício quando o formulário é enviado
formTreino.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const novoTreino = {
        id: Date.now(),
        nome: nome.value.trim(),
        tipo: tipo.options[tipo.selectedIndex].text
            .toLowerCase(),
        series: [],
        duracao: "",
        distancia: ""
    };

    if (tipo.value === "musculacao" || tipo.value === "alongamento") {
        const quantidade = Number(quantidadeSeries.value);

        if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 50) {
            alert("Informe uma quantidade de séries entre 1 e 50.");
            return;
        }

        for (let i = 1; i <= quantidade; i++) {
            const repeticoes = document.getElementById(`repeticoes-${i}`);
            const carga = document.getElementById(`carga-${i}`);

            if (!repeticoes || !carga || repeticoes.value === "" || carga.value === "") {
                alert(`Preencha as repetições e a carga da série ${i}.`);
                return;
            }

            novoTreino.series.push({
                repeticoes: repeticoes.value,
                carga: carga.value
            });
        }
    }

    if (tipo.value === "cardio") {
        const duracao = document.getElementById("duracaoCardio").value;
        const distancia = document.getElementById("distanciaCardio").value;

        if (duracao === "" || Number(duracao) < 1) {
            alert("Informe a duração do exercício.");
            return;
        }

        novoTreino.duracao = duracao;
        novoTreino.distancia = distancia;
    }

    treinos.push(novoTreino);

    salvarTreinos();
    mostrarTreinos();

    // Limpa o formulário depois de registrar
    formTreino.reset();
    camposSeries.style.display = "none";
    camposCardio.style.display = "none";
    listaSeries.innerHTML = "";
});

// Exibe os exercícios salvos ao abrir a página
mostrarTreinos();
