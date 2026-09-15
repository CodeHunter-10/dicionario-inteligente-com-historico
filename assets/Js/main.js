    import dom from "./dom.js";
    import functions from "./funcoes.js";
    import buscarNoDicionario from "./api.js";

    let idDaBusca = 0;
    const campoDePesquisa = dom.input;
    const historicoEstado = [];
    ColetarHistoricoDoLocalStorage();
    
    const debounced = functions.debounce(executarBusca,800);

campoDePesquisa.addEventListener("input", () => {//REFAT OK
    idDaBusca++;
    debounced(campoDePesquisa.value);
})

dom.formulario.addEventListener("submit",(e)=>{//REFAT OK
    e.preventDefault();
    iniciarBusca(campoDePesquisa.value);
})

dom.listaHistoricoDePesquisa.addEventListener("click",(e)=>{//REFAT OK
    const termo = encontrarElementoFilhoMaisProximo(e,"li");
    const botao = encontrarElementoFilhoMaisProximo(e,"button");
    if (botao) {
        deletarItemDoHistorico(e,termo); 
    return;}
    buscarTermoDoHistorico(termo)
})

dom.listaFiltradaHistorico.addEventListener("click", (e) => {// REFAT OK
    const termo = encontrarElementoFilhoMaisProximo(e,"li");
    const botao = encontrarElementoFilhoMaisProximo(e,"button");
    if (botao) {
        deletarItemDoHistorico(e,termo,deletarItemDoHistoricoFiltrado)
        return;
    }
    buscarTermoDoHistorico(termo)
})


dom.botaoLimparHistorico.addEventListener("click",limparHistorico)//refat ok 
    
dom.pesquisarNoHistorico.addEventListener("input", (e) => {
    let inputDoHistorico = e.target.value;
    atualizarPesquisaHistorico(inputDoHistorico);
});

function atualizarPesquisaHistorico(inputDoHistorico) {//aparentemente refat ok
    if (inputDoHistorico.length > 0) {
        renderizarHistoricoFiltrado(criarRespostaParaEnviarAoDOM(pesquisarNoHistorico()));
    }
    else {
        mostrarHistoricoCompleto();
    }
}

function mostrarHistoricoCompleto() {
    dom.listaHistoricoDePesquisa.style.display = "flex";
    dom.listaFiltradaHistorico.style.display = "none";

    if (historicoEstado.length === 0) {dom.historicoParagrafo.style.display = "block"};
}

function mostrarHistoricoFiltrado() {
    dom.listaFiltradaHistorico.style.display = "flex";
    dom.listaFiltradaHistorico.innerHTML = "";

    dom.listaHistoricoDePesquisa.style.display = "none";
    dom.historicoParagrafo.style.display = "none";
}


function pesquisarNoHistorico() {
    const valor = dom.pesquisarNoHistorico.value;

    if (historicoEstado.length < 1) {
        return "Não existe nenhuma palavra no historico para ser Pesquisada";}

    if(valor?.trim() &&historicoEstado.length>0){
        return pesquisarNoArray(historicoEstado,"termo",valor);
    }
}

function pesquisarNoArray(arrayParaPesquisar,termo, pesquisa){
        const pesquisaFormatada = pesquisa.toLowerCase().trim();
        return arrayParaPesquisar.filter(
            array=> {
                    return array[termo]
                        .toLowerCase()
                        .trim()
                        .includes(pesquisaFormatada);
                }
        )
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
        return;} 
    else { 
        
        for (let i = 0; i < resposta.length; i++) {
                let novoItem = dom.renderizarElementoNoHistorico(resposta[i]);
                dom.listaFiltradaHistorico.appendChild(novoItem);
            }
    }
}

function limparHistorico() {
    historicoEstado.length = 0;
    localStorage.clear();
    dom.limparInterfaceDoHistorico(); 
}

function iniciarBusca(valor) {
    idDaBusca++;
    debounced.cancel();
    executarBusca(valor);
}

function renderizarRespostaAPI(resposta) {
    dom.termo.textContent = resposta?.palavra;
    const descricao = resposta?.significado;

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
    if (dom.pesquisarNoHistorico.value.trim()) {
        renderizarHistoricoFiltrado(pesquisarNoHistorico());
    }
    let novaLista = dom.renderizarElementoNoHistorico(novoItem);
    dom.listaHistoricoDePesquisa.prepend(novaLista);
}

async function executarBusca(valor) {
    if (!valor.trim()) { return; }
    const idDaRequisiçaoAtual = idDaBusca;
    dom.statusCarregando();
    let resposta = await buscarNoDicionario(valor);

    if (idDaRequisiçaoAtual !== idDaBusca) {
        dom.status.textContent = "";
        return;
    }
    if (resposta === null) {
        dom.status.textContent = "";
        dom.erro.textContent = "houve um problema ao buscar tente novamente mais tarde.";
        return;
    }
    if (resposta === false) {
        dom.status.textContent = "";
        dom.erro.textContent = "Palavra Nao Encontrada no Dicionario";
        return;
    }
    campoDePesquisa.value = "";
    try { renderizarRespostaAPI(resposta); }
    catch (e) {
        console.error(e);
        //esvaziaoStatus
        dom.status.textContent = "";
        //renderiza o erro no dom
        dom.erro.textContent = "Nao foi possivel renderizar o resultado.";
    }
}

function ColetarHistoricoDoLocalStorage(){
        if(localStorage.length > 0 ){
            for(let i =0; i < localStorage.length ; i++){

                //pega valor do localStorage
                const chave = localStorage.key(i);
                const valor = localStorage.getItem(chave);

                // coloca o valor deu um JSON dentro de um indice do historico 
                historicoEstado.push(JSON.parse(valor));

                // renderiza o o elemento do historicoEstado dentro dom historico de pesquisa no dom 
                dom.listaHistoricoDePesquisa.prepend(dom.renderizarElementoNoHistorico(historicoEstado[i]));
            }
        }
    }

        function encontrarElementoFilhoMaisProximo(e ,elementoHTML) {
        return e.target.closest(elementoHTML) 
    }


    function deletarItemDoHistoricoFiltrado(termo){
        let dataID = termo.getAttribute("data-id");//pega o atributo data id e depois deleta 
                dom.listaHistoricoDePesquisa.querySelector(`li[data-id="${dataID}"]`).remove();
    }
        function deletarItemDoHistorico(e,termo,funcao){
                functions.deletaritemDoHistoricoEstado(termo,historicoEstado);
                e.stopPropagation();

                if(funcao){funcao(termo)}

                termo.remove();
             
        };
        function buscarTermoDoHistorico(termo){
            if(!termo){return;}
                const palavra = dom.obterTermo(termo);
            if (!palavra){return;}
                iniciarBusca(palavra);
        }