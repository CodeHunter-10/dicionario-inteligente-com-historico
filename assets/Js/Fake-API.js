export default async function buscarNoDicionario(input){
    try{
        input = input.toLowerCase();

        const resposta = await fetch(`https://api.dicionario-aberto.net/word/${input}`);

        if(!resposta.ok){throw new Error("Erro na Requisiçao")};
        const dados = await resposta.json();

        if(!dados[0]){return false};
        const xml =  dados[0].xml;

        return parseXml(xml);
}
    catch(err){
        console.error(`Erro: ${err.message}`);
    }
}
function parseXml(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml,'text/xml');

    const palavra = ExtrairPalavra(xmlDoc);
    const significado = ExtrairSignificados(xmlDoc);
    
    return {palavra , significado };
}

function ExtrairPalavra(xmlDoc){
    const palavra = xmlDoc.getElementsByTagName("orth");
    return palavra[0]?.textContent || "Palavra Nao Encontrada";
}
function ExtrairSignificados(xmlDoc){
    const output = [];
        const defs = xmlDoc.getElementsByTagName("def");
        for(let i =0;i<defs.length;i++){
            let texto = (defs[i].textContent);
            let frase = texto.split("\n") ;
                frase = frase
                .map(f=>f.trim())
                .filter(f=>f.length>0);
            output.push(...frase);
        }
    return output
}