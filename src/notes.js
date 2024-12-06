const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const caminhoNotas = path.join(__dirname, '../data/notes.json');

// Função para ler notas do arquivo JSON
function lerNotas() {
    const dados = fs.readFileSync(caminhoNotas);
    return JSON.parse(dados);
}

// Função para salvar notas no arquivo JSON
function salvarNotas(notes) {
    fs.writeFileSync(caminhoNotas, JSON.stringify(notes, null, 2));
}

// Exportando as funções
module.exports = {
    lerNotas,
    salvarNotas
};