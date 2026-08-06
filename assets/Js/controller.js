    import dom from "./Dom.js";
    import functions from "./Funcoes.js";
    import buscarNoDicionario from "./Fake-API.js";

    let SearchID = 0;
    const campoDePesquisa = dom.input;
    let historicoEstado = [];
    
    let debounced = functions.debounce(executarBusca,800)

campoDePesquisa.addEventListener("input", () => {
    SearchID++;
    debounced(campoDePesquisa.value);
})

dom.formulario.addEventListener("submit",(e)=>{
    e.preventDefault();
    iniciarBusca(campoDePesquisa.value);
})

dom.listaHistoricoDePesquisa.addEventListener("click",(e)=>{
    const termo = e.target.closest("li");
    if (!termo) { return; }
    console.log(historicoEstado)
    

    const botao = e.target.closest('button');
        if (botao){
            functions.DeletaritemDoHistorico(termo,historicoEstado)
            e.stopPropagation();
            termo.remove();
            return;
        }
    
        const palavra = dom.obterTermo(termo);
        if (!palavra){return;}

    iniciarBusca(palavra);
})

dom.listaFiltradaHistorico.addEventListener("click", (e) => {
    const termo = e.target.closest("li");
    if (!termo) { return; }
    const botao = e.target.closest('button')

    if (botao) {
            functions.DeletaritemDoHistorico(termo, historicoEstado)
            e.stopPropagation();
            console.log(termo)
            let dataID = termo.getAttribute("data-id");
                dom.listaHistoricoDePesquisa.querySelector(`li[data-id="${dataID}"]`).remove();
            termo.remove();
            return;
    }

    if (termo) {
        const palavra = dom.obterTermo(termo);
        if (!palavra) { return; }

        iniciarBusca(palavra);
    }

        console.log(...historicoEstado)
})


dom.botaoLimparHistorico.addEventListener("click",limparHistorico)

    //refatorar depois de criar
    
dom.pesquisarNoHistorico.addEventListener("input", (e) => {
    let inputDoHistorico = e.target.value
    atualizarPesquisaHistorico(inputDoHistorico)
});

function atualizarPesquisaHistorico(inputDoHistorico) {
    if (inputDoHistorico.length > 0) {
        renderizarHistoricoFiltrado(criarRespostaParaEnviarAoDOM(pesquisarNoHistorico()));
    }
    else {
        mostrarHistoricoCompleto();
    }
}

function mostrarHistoricoCompleto() {
    dom.listaHistoricoDePesquisa.style.display = "flex"

    dom.listaFiltradaHistorico.style.display = "none"
    if (historicoEstado.length === 0) {dom.historicoParagrafo.style.display = "block"}
}

function mostrarHistoricoFiltrado() {
    dom.listaFiltradaHistorico.style.display = "flex"
    dom.listaFiltradaHistorico.innerHTML = ""

    dom.listaHistoricoDePesquisa.style.display = "none"
    dom.historicoParagrafo.style.display = "none"
}


function pesquisarNoHistorico() { //esta funcionando perfeitamente
    const valor = dom.pesquisarNoHistorico.value

    if (historicoEstado.length < 1) {
        return "Não existe nenhuma palavra no historico para ser Pesquisada";}

    if(valor?.trim() &&historicoEstado.length>0){
        return pesquisarNoArray(historicoEstado,"termo",valor)
    }
}

function pesquisarNoArray(arrayParaPesquisar,termo, pesquisa){
        let pesquisaFormatada = pesquisa
                                .toLowerCase()
                                .trim();
        let arrayFiltrado = arrayParaPesquisar.filter(
            array=> {
                let ObjetoFiltrado = 
                                array[termo]
                                        .toLowerCase()
                                        .trim()
                                        .includes(pesquisaFormatada)
                                    return ObjetoFiltrado
                                })
    return arrayFiltrado
}

function criarRespostaParaEnviarAoDOM(resultado) {
    // 1. resposta veio vazia
    if (resultado == null) {
        return 'não existe nenhuma palavra no campo de pesquisa';
    }

    // 2. erro já formatado
    if (typeof resultado === "string") {
        return resultado;
    }

    // 3. garantir que é um array
    if (!Array.isArray(resultado)) {
        return 'formato de resposta inválido';
    }

    // 4. array vazio
    if (resultado.length === 0) {
        return "não existe nenhuma palavra no histórico que contém essa pesquisa!";
    }

    // 5. array com dados
    return resultado;
}

function renderizarHistoricoFiltrado(resposta) {
    mostrarHistoricoFiltrado();

    if (typeof resposta === "string") {
            let novoItem = document.createElement("li");
            novoItem.textContent = resposta;
            dom.listaFiltradaHistorico.appendChild(novoItem);
        return
 90   } 
    else { 
        
        for (let i = 0; i < resposta.length; i++) {
                let novoItem = dom.renderizarElementoNoHistorico(resposta[i]);
                dom.listaFiltradaHistorico.appendChild(novoItem);
            }
    }
}

function limparHistorico() {
    historicoEstado = [];
    dom.limparInterfaceDoHistorico();
}

function iniciarBusca(valor) {
    SearchID++;
    debounced.cancel();
    executarBusca(valor);
}

function renderizarRespostaAPI(resposta) {
    dom.termo.textContent = resposta?.palavra;
    let descricao = resposta?.significado;

    if (!Array.isArray(descricao) || descricao.length === 0) {
        dom.status.textContent = "";
        dom.erro.textContent = "Nenhum significado encontrado para essa palavra.";
        return;
    }

    dom.status.textContent = "";

    for (let i = 0; i < descricao.length; i++) {
        let novoP = document.createElement("p");
        novoP.textContent = descricao[i];
        dom.significados.appendChild(novoP);
    }
    const novoItem = functions.salvarBusca(resposta?.palavra)
    historicoEstado.push(novoItem);
    console.log(novoItem)
    if (dom.pesquisarNoHistorico.value.trim()) {
        renderizarHistoricoFiltrado(pesquisarNoHistorico());
    }

    //atualizar o histórico aqui 

    let novaLista = dom.renderizarElementoNoHistorico(novoItem);
    console.log(novaLista)
    dom.listaHistoricoDePesquisa.prepend(novaLista);
}

async function executarBusca(valor) {
    if (!valor.trim()) { return; }
    const idDaRequisiçaoAtual = SearchID;
    dom.statusCarregando(dom);
    let resposta = await buscarNoDicionario(valor);

    if (idDaRequisiçaoAtual !== SearchID) {
        dom.status.textContent = "";
        return
    }
    if (resposta === null) {
        dom.status.textContent = "";
        dom.erro.textContent = "houve um problema ao buscar tente novamente mais tarde.";
        return
    }
    if (resposta === false) {
        dom.status.textContent = "";
        dom.erro.textContent = "Palavra Nao Encontrada no Dicionario";
        return
    }
    campoDePesquisa.value = "";
    try { renderizarRespostaAPI(resposta); }
    catch (e) {
        console.error(e.message);
        dom.status.textContent = "";
        dom.erro.textContent = "Nao foi possivel renderizar o resultado.";
    }
}