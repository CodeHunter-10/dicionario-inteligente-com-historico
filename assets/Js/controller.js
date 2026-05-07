    import dom from "./Dom.js";
    import functions from "./Funcoes.js";
    import buscarNoDicionario from "./Fake-API.js";

    let SearchID = 0;
    const campoDePesquisa = dom.input;
    let historico = [];

    let debounced = functions.debounce(executarBusca,800)

    campoDePesquisa.addEventListener("input",()=>{
        SearchID++;
        debounced(campoDePesquisa.value);
    })

    dom.formulario.addEventListener("submit",(e)=>{
        e.preventDefault();
        iniciarBusca(campoDePesquisa.value);
    })

    dom.historicoDePesquisa.addEventListener("click",(e)=>{
        const pesquisa = e.target.closest("ul");
        if (!pesquisa) {return;}

        const botao = e.target.closest('button');
            if (botao){
                e.stopPropagation();
                pesquisa.remove();
                return;
            }
        
            const palavra = dom.obterTermo(pesquisa);
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
            novoP.id = `definicao_${i}`;
            novoP.textContent = resposta.significado[i];
            dom.significados.appendChild(novoP);
        }
        
        historico.push(functions.salvarBusca(resposta?.palavra));
        let novaLista = dom.RenderizarHistorico(historico);
        dom.historicoDePesquisa.prepend(novaLista);
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