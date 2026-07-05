    import dom from "./Dom.js";
    import functions from "./Funcoes.js";
    import buscarNoDicionario from "./Fake-API.js";

    let SearchID = 0;
    const campoDePesquisa = dom.input;
    let historicoEstado = [];

    let debounced = functions.debounce(executarBusca,800)

    campoDePesquisa.addEventListener("input",()=>{
        SearchID++;
        debounced(campoDePesquisa.value);
    })

    dom.formulario.addEventListener("submit",(e)=>{
        e.preventDefault();
        iniciarBusca(campoDePesquisa.value);
    })

    dom.listaHistoricoDOM.addEventListener("click",(e)=>{
        const termo = e.target.closest("li");
        if (!termo) {return;}

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

    function iniciarBusca(valor){
        SearchID++;
        debounced.cancel();
        executarBusca(valor);
    }
    function renderizarRespostaAPI(resposta){
        dom.termo.textContent = resposta?.palavra;
        let descricao = resposta?.significado;

        if(!Array.isArray(descricao) || descricao.length === 0) {
            dom.status.textContent = "";
            dom.erro.textContent = "Nenhum significado encontrado para essa palavra.";
            return;
        }
        dom.status.textContent = "";
    
        for(let i = 0 ; i< descricao.length; i++){
            let novoP = document.createElement("p");
            novoP.textContent = descricao[i];
            dom.significados.appendChild(novoP);
        }
        const novoItem = functions.salvarBusca(resposta?.palavra)
        historicoEstado.push(novoItem);
        console.log(novoItem)

        let novaLista = dom.RenderizarHistorico(novoItem);
        console.log(novaLista)
        dom.listaHistoricoDOM.prepend(novaLista);
    }

        async function executarBusca(valor){
        if(!valor.trim()){return;}
        const idDaRequisiçaoAtual = SearchID;
        dom.statusCarregando(dom);
        let resposta = await buscarNoDicionario(valor);
        
        if(idDaRequisiçaoAtual!==SearchID) {
            dom.status.textContent = "";
            return}
        if(resposta === null){
            dom.status.textContent = "";
            dom.erro.textContent = "houve um problema ao buscar tente novamente mais tarde.";
            return
        }
        if(resposta === false) {
            dom.status.textContent = "";
            dom.erro.textContent = "Palavra Nao Encontrada no Dicionario";
            return
        }
        campoDePesquisa.value = "";
        try{renderizarRespostaAPI(resposta);}
        catch(e){
            console.error(e.message);
            dom.status.textContent = "";
            dom.erro.textContent = "Nao foi possivel renderizar o resultado.";
        }
        }

        dom.botaoLimparHistorico.addEventListener("click",limparHistorico)

        function limparHistorico(){
            historicoEstado = [];
            dom.listaHistoricoDOM.innerHTML = "";
        }

        //refatorar depois de criar 
        dom.PesquisarNoHistorico.addEventListener("input", async (e) => {
            let resultado = pesquisarHistorico();
            let resposta = criarRespostaParaEnviarAoDOM(resultado)
            console.log(resposta)

            let quantidadeDeLetrasNoInputDoHistorico = e.target.value.length

            if(quantidadeDeLetrasNoInputDoHistorico>0){

                dom.listaHistoricoDOM.style.display = "none"
                dom.listaFiltradaHistorico.style.display = "flex"
                renderizarHistoricoFiltrado(resposta)

            }
            else if (quantidadeDeLetrasNoInputDoHistorico<=0){

                dom.listaHistoricoDOM.style.display = "flex"
                dom.listaFiltradaHistorico.style.display = "none"

            }
            //(resposta)=>{}()
            //preciso manipular o resultado aqui !  
            // significa que preciso do resultado qual e a melhor funçao para colocar aqui e porque ?
        });

const pesquisarHistorico = () => { //esta funcionando perfeitamente
    const valor = dom.obterValorDoDOM(dom.PesquisarNoHistorico);

    if(historicoEstado.length<1){
        return "Não existe nenhuma palavra no historico para ser Pesquisada";}

    if(valor?.trim() &&historicoEstado.length>0){
        return PesquisarNoArray(historicoEstado,"termo",valor)
    }
}

function PesquisarNoArray(arrayParaPesquisar,termo, pesquisa){
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
    dom.listaFiltradaHistorico.innerHTML = ""

    if (typeof resposta === "string") {
        let novoItem = document.createElement("li");
        novoItem.textContent = resposta;
        dom.listaFiltradaHistorico.appendChild(novoItem);
        return
    } 
    else{
    for (let i = 0; i < resposta.length; i++) {

        let novoItem = dom.RenderizarHistorico(resposta[i]);
        dom.listaFiltradaHistorico.appendChild(novoItem);
        console.log(novoItem)
        console.log(historicoEstado)
        }
    }
}