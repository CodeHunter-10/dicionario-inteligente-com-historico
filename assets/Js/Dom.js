
function obterITEM(ObjetoDOM) {
    return document.querySelector(ObjetoDOM)
}
const dom = {
    formulario: obterITEM("form"),
    input: obterITEM("#Buscador_Inteligente"),
    status: obterITEM("#status"),
    termo: obterITEM("#termo"),
    significados: obterITEM("#significados"),
    erro: obterITEM("#error"),
    botaoMenu: obterITEM("#menu"),
    menuHistorico: obterITEM('#historico'),
    listaHistoricoDePesquisa: obterITEM("#listaHistoricoDOM"),
    listaFiltradaHistorico: obterITEM("#listaFiltradaHistoricoDOM"),
    verbete: obterITEM("#Verbete"),
    historicoParagrafo: obterITEM("#paragradoDoHistorico"),
    botaoLimparHistorico: obterITEM("#limparHistorico"),
    pesquisarNoHistorico: obterITEM("#pesquisarNoHistorico"),
    obterTermo: obterTermo,
    renderizarElementoNoHistorico: renderizarElementoNoHistorico,
    statusCarregando: statusCarregando,
    obterValorDoDOM: obterValorDoDOM,
    limparInterfaceDoHistorico: limparInterfaceDoHistorico,
    // AlternarListaDeHistoricoExibido:AlternarListaDeHistoricoExibido,
}
export default dom


function limparInterfaceDoHistorico() {
    dom.listaHistoricoDePesquisa.innerHTML = "";
    dom.listaFiltradaHistorico.innerHTML = "";
    dom.historicoParagrafo.style.display = "block";
    dom.pesquisarNoHistorico.value = "";
}

function renderizarElementoNoHistorico(input) {

    // UL principal
    const ul = CriarElemento("li", "lista-historico");
    ul.setAttribute("data-id", input.id)
    // Div que agrupa termo + data
    const divInfo = CriarElemento("div");

    const termo = CriarElemento("p", "termo", `termo: ${input.termo}`);
    const data = CriarElemento("p", "data", `data: ${input.data}`);

    divInfo.appendChild(termo);
    divInfo.appendChild(data);

    // Div da lixeira
    const divLixeira = CriarElemento("button", "btnLixeira", "🗑️");

    // Montagem final
    ul.appendChild(divInfo);
    ul.appendChild(divLixeira);

    return ul;
}

function CriarElemento(elemento, classe, texto, identificador) {
    const novoElemento = document.createElement(elemento);
    if (texto) { novoElemento.textContent = texto }
    if (classe) { novoElemento.className = classe }
    if (identificador) { novoElemento.id = identificador }

    return novoElemento
}

function statusCarregando(dom) {
    dom.termo.textContent = ""
    dom.significados.innerHTML = "";
    dom.erro.textContent = "";
    dom.status.textContent = "Carregando...";
}
function atualizarVisibilidadeDoHistorico() {
    const historicoVazio = dom.listaHistoricoDePesquisa.children.length === 0;

    dom.botaoLimparHistorico.style.display = historicoVazio ? "none" : "block"
    dom.historicoParagrafo.style.display = historicoVazio ? "block" : "none";
}

const observadorDoHistorico = new MutationObserver(() => {
    atualizarVisibilidadeDoHistorico();
});

observadorDoHistorico.observe(dom.listaHistoricoDePesquisa, {
    childList: true
});

atualizarVisibilidadeDoHistorico();


dom.botaoMenu.addEventListener("click", (e) => {
    e.stopPropagation();

    const historicoAberto = dom.menuHistorico.style.display === 'flex';
    dom.menuHistorico.style.display = historicoAberto ? 'none' : 'flex';
});

document.addEventListener("click", (e) => {
    if (!dom.menuHistorico.contains(e.target) && !dom.botaoMenu.contains(e.target)) {
        fecharHistorico();
    }
});


function obterTermo(item) {
    if (!item) { return null; }
    let pesquisa = item.querySelector(".termo");
    if (!pesquisa) { return null; }
    pesquisa = pesquisa.textContent;
    let palavra = pesquisa.replace("termo: ", "").toLowerCase();
    return palavra;
}

function obterValorDoDOM(input) {
    if (!input) { return }
    return input.value
}
function fecharHistorico() {
    dom.menuHistorico.style.display = 'none';
}