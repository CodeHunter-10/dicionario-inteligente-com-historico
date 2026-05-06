    import dom from "./Dom.js";
    import functions from "./Funcoes.js";
    import buscarNoDicionario from "./Fake-API.js";

    const formulario = dom.formulario;
    const campoDePesquisa = dom.input;
    let SearchID = 0;
    let historico = [];

    async function executarBusca(valor){
        if(!valor.trim()){return;}
        const idDaRequest = SearchID;
        dom.statusCarregando(dom)
        let resposta = await buscarNoDicionario(valor);
        
        if(idDaRequest!=SearchID) {
            dom.status.textContent = "";
            return}
        if(resposta === false) {
            dom.status.textContent = "";
            dom.erro.textContent = "Palavra Nao Encontrada no Dicionario"
            return 
        }
        campoDePesquisa.value = ""
        try{
        dom.termo.textContent = resposta?.palavra;
        let descricao = resposta?.significado;

        if(!descricao)return
        let quantidadeDeFrasesDaDescricao = descricao?.length
        dom.status.textContent = ""
        for(let i = 0 ; i< quantidadeDeFrasesDaDescricao; i++){
            let novoP = document.createElement("p")
            novoP.id = `definicao_${i}`
            novoP.textContent = resposta.significado[i]
            dom.significados.appendChild(novoP)
        }
        
        historico.push(functions.salvarBusca(resposta?.palavra))
        console.log(historico)
        let novaLista = dom.RenderizarHistorico(historico)
        dom.historicoDePesquisa.prepend(novaLista)
            }
        catch(e){return}
        }

    let debounced = functions.debounce(executarBusca,800)


    campoDePesquisa.addEventListener("input",()=>{
        SearchID++
        debounced(campoDePesquisa.value);
    })

    formulario.addEventListener("submit",(e)=>{
        e.preventDefault();
        SearchID++;
        debounced.cancel();
        executarBusca(campoDePesquisa.value);
    })

    dom.historicoDePesquisa.addEventListener("click",(e)=>{
        let pesquisa = e.target.closest("ul");
        let botao = e.target.closest('button')
        if (!pesquisa) {return;}
        if (!botao) {
            let palavra = dom.obterTermo(pesquisa);
            if (!palavra) {return;}
            SearchID++;
            debounced.cancel();
            executarBusca(palavra);}
        if (botao){
            e.stopPropagation();
            console.log(pesquisa)
            console.log(historico)
            pesquisa.remove()
        }
    })
