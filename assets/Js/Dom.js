//import { createElement } from "react"

const dom =  {
    formulario: document.querySelector("form"),
    input: document.querySelector("#Buscador_Inteligente"),
    status: document.querySelector("#status"),
    termo: document.querySelector("#termo"),
    significados: document.querySelector("#significados"),
    erro: document.querySelector("#error"),
    menu : document.querySelector("#menu"),
    historico:document.querySelector('#historico'),
    historicoDePesquisa: document.querySelector("#historicoDePesquisa"),
    verbete:document.querySelector("#Verbete"),
    historicoParagrafo:document.querySelector("#paragradoDoHistorico"),
    obterTermo:obterTermo,
    RenderizarHistorico: RenderizarHistorico,
    statusCarregando:statusCarregando,
    atualizarEstadoDoHistorico: atualizarEstadoDoHistorico
    }
export default dom  


function RenderizarHistorico(input){
    let indice = input.length;
    let arrayAtual = input[indice - 1];

    // UL principal
    const ul = CriarElemento("ul", "lista-historico", null, `item${indice}`);

    // Div que agrupa termo + data
    const divInfo = CriarElemento("div");

    const termo = CriarElemento("p","termo",`termo: ${arrayAtual.termo}`,`termo-${indice}`);
    const data = CriarElemento("p","data",`data: ${arrayAtual.data}`,`data-${indice}`);

    divInfo.appendChild(termo);
    divInfo.appendChild(data);

    // Div da lixeira
    const divLixeira = CriarElemento("button","btnLixeira","🗑️" ,`lixeira${indice}`,"indice");

    // Montagem final
    ul.appendChild(divInfo);
    ul.appendChild(divLixeira);

    return ul;
}

function CriarElemento(elemento, classe, texto , identificador){
    const novoElemento = document.createElement(elemento);
    if(texto) {novoElemento.textContent = texto}
    if(classe) {novoElemento.className = classe}
    if(identificador) {novoElemento.id = identificador}

    return novoElemento
}


function DeletarItem(){

}
function statusCarregando(dom){
    dom.termo.textContent = ""
    dom.significados.innerHTML = "";
    dom.erro.textContent = "";
    dom.status.textContent = "Carregando...";
}

function atualizarEstadoDoHistorico(){
    const historicoVazio = dom.historicoDePesquisa.children.length === 0;
    dom.historicoParagrafo.style.display = historicoVazio ? "block" : "none";
}

const observadorDoHistorico = new MutationObserver(() => {
    atualizarEstadoDoHistorico();
});

observadorDoHistorico.observe(dom.historicoDePesquisa, {
    childList: true
});

atualizarEstadoDoHistorico();


dom.menu.addEventListener("click",(e)=>{
    e.stopPropagation();
    dom.historico.style.display = dom.historico.style.display === 'flex' ? 'none' : 'flex';
}); 

document.addEventListener("click", (e) => {

    // Verifica se o clique foi FORA do historico E FORA do botão do menu
    if (!dom.historico.contains(e.target) && !dom.menu.contains(e.target)) {
        dom.historico.style.display = 'none';
    }
});

    function obterTermo(item){
            if (!item) {return null;}

            let pesquisa = item.querySelector(".termo");
            if (!pesquisa) {return null;}

            pesquisa = pesquisa.textContent;
            let palavra = pesquisa.replace("termo: ", "").toLowerCase();
            return palavra;
    }
