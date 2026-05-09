
const dom =  {
    formulario: document.querySelector("form"),
    input: document.querySelector("#Buscador_Inteligente"),
    status: document.querySelector("#status"),
    termo: document.querySelector("#termo"),
    significados: document.querySelector("#significados"),
    erro: document.querySelector("#error"),
    menu : document.querySelector("#menu"),
    AbaHistoricoDOM:document.querySelector('#historico'),
    listaHistoricoDOM: document.querySelector("#listaHistoricoDOM"),
    verbete:document.querySelector("#Verbete"),
    historicoParagrafo:document.querySelector("#paragradoDoHistorico"),
    botaoLimparHistorico:document.querySelector("#limparHistorico"),
    obterTermo:obterTermo,
    RenderizarHistorico: RenderizarHistorico,
    statusCarregando:statusCarregando,
    atualizarEstadoDoHistorico: atualizarEstadoDoHistorico
    }
export default dom  


function RenderizarHistorico(input){

    // UL principal
    const ul = CriarElemento("li", "lista-historico");
    ul.setAttribute("data-id", input.id)
    // Div que agrupa termo + data
    const divInfo = CriarElemento("div");

    const termo = CriarElemento("p","termo",`termo: ${input.termo}`);
    const data = CriarElemento("p","data",`data: ${input.data}`);

    divInfo.appendChild(termo);
    divInfo.appendChild(data);

    // Div da lixeira
    const divLixeira = CriarElemento("button","btnLixeira","🗑️");

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

function statusCarregando(dom){
    dom.termo.textContent = ""
    dom.significados.innerHTML = "";
    dom.erro.textContent = "";
    dom.status.textContent = "Carregando...";
}

function atualizarEstadoDoHistorico(){
    const historicoVazio = dom.listaHistoricoDOM.children.length === 0;
    dom.historicoParagrafo.style.display = historicoVazio ? "block" : "none";
    dom.botaoLimparHistorico.style.display= historicoVazio ?"none":"block"
}

const observadorDoHistorico = new MutationObserver(() => {
    atualizarEstadoDoHistorico();
});

observadorDoHistorico.observe(dom.listaHistoricoDOM, {
    childList: true
});

atualizarEstadoDoHistorico();


dom.menu.addEventListener("click",(e)=>{
    e.stopPropagation();
    dom.AbaHistoricoDOM.style.display = dom.AbaHistoricoDOM.style.display === 'flex' ? 'none' : 'flex';
}); 

document.addEventListener("click", (e) => {

    if (!dom.AbaHistoricoDOM.contains(e.target) && !dom.menu.contains(e.target)) {
        dom.AbaHistoricoDOM.style.display = 'none';
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
