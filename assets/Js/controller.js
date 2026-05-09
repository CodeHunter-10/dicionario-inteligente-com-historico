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

        if(!descricao) {return}
        dom.status.textContent = "";
    
        for(let i = 0 ; i< descricao.length; i++){
            let novoP = document.createElement("p");
            novoP.textContent = resposta.significado[i];
            dom.significados.appendChild(novoP);
        }
        const novoItem = functions.salvarBusca(resposta?.palavra)
        historicoEstado.push(novoItem);

        let novaLista = dom.RenderizarHistorico(novoItem);
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
        if(resposta === false) {
            dom.status.textContent = "";
            dom.erro.textContent = "Palavra Nao Encontrada no Dicionario";
            return
        }
        campoDePesquisa.value = "";
        try{renderizarRespostaAPI(resposta);}
        catch(e){console.error(e.message);}
        }

        dom.botaoLimparHistorico.addEventListener("click",()=>{
            historicoEstado = [];
            dom.listaHistoricoDOM.innerHTML = "";
        })