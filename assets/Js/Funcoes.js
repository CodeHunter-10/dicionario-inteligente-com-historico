let functions = {
    debounce: debounce,
    salvarBusca:salvarBusca,
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
        termo:input,
        data: new Date().toLocaleString("pt-BR")}
    return historico
}
