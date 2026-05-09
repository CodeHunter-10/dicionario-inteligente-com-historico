const functions = {
    debounce: debounce,
    salvarBusca:salvarBusca,
    DeletaritemDoHistorico:DeletaritemDoHistorico,
}

export default functions 

function debounce(fn,delay){
    let timer;
        function debounced(...args){
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
                timer = null;
            }, delay);
        }
        debounced.cancel = () => {
            clearTimeout(timer);
            timer = null;
        };
    return debounced;
}

function salvarBusca(input){
    let historico = {
        id: Date.now(),
        termo:input,
        data: new Date().toLocaleString("pt-BR")
    }
    return historico
}
function DeletaritemDoHistorico(input,historico) { 
        const idParaRemover = input.getAttribute("data-id");
        const numeroID = historico.findIndex(item => item.id == idParaRemover);
    if(numeroID!==-1){
        historico.splice(numeroID,1); 
    }
    else {
        console.warn("ID não encontrado no array:", idParaRemover);
    }

}