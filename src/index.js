// src/index.js
const express = require('express');
const path = require('path');
const { lerNotas, salvarNotas } = require('./notes'); // Importando as funções

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para arquivos estáticos (como imagens, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true })); // Para processar dados do formulário

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.render('dashboard');
});

app.get('/list', (req, res) => { 
  res.render('list'); 
});

app.get('/notes', (req, res) => {
  res.render('notes');
});

// Rota para exibir todas as notas
app.get('/list_notes', (req, res) => {
  const notas = lerNotas();
  res.render('list_notes', { notas }); // Passando as notas para a view
});

app.post('/add-note', (req, res) => {
  const novaNota = req.body.nota;
  const notas = lerNotas(); // Função que lê as notas do arquivo
  notas.push(novaNota); // Adiciona a nova nota
  salvarNotas(notas); // Salva as notas atualizadas
  res.redirect('/'); // Redireciona para a página principal
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});