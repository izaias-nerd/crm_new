// src/index.js
const express = require('express');
const path = require('path');
const { createServer } = require('node:http');
const { lerNotas, salvarNotas } = require('./notes'); // Importando as funções
const { v4: uuidv4 } = require('uuid');
const { initSocketIO } = require('./socket'); // Importando a função initSocketIO

// Inicializando o app e o servidor
const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);

// Inicializa o Socket.IO
const io = initSocketIO(server); // Passa o servidor HTTP para a função initSocketIO

// Configuração de middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração para arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '../public')));

// Configuração do mecanismo de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Rotas
app.get('/', (req, res) => {
  res.render('dashboard');
});

app.get('/list', (req, res) => {
  res.render('list');
});

app.get('/notes', (req, res) => {
  res.render('notes');
});

app.get('/links', (req, res) => {
  res.render('links');
});

app.get('/list_notes', (req, res) => {
  const notas = lerNotas(); // Lê as notas do arquivo
  res.render('list_notes', { notas }); // Passa as notas para a visualização
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

app.post('/add-note', (req, res) => {
  const novaNota = req.body.nota;

  // Validação da entrada
  if (!novaNota || typeof novaNota !== 'string') {
    return res.status(400).send('Nota inválida');
  }

  const notesId = uuidv4(); // Gera um UUID único
  const notas = lerNotas(); // Lê as notas existentes

  notas.push({ id: notesId, nota: novaNota }); // Adiciona a nova nota como objeto
  salvarNotas(notas); // Salva as notas atualizadas

  res.redirect('/list_notes'); // Redireciona para a página de notas
});

app.post('/delete-note/:id', (req, res) => {
  const notaId = req.params.id; // Pega o ID da nota da URL
  let notas = lerNotas(); // Lê as notas existentes

  // Filtra as notas, removendo a nota com o ID correspondente
  notas = notas.filter(nota => nota.id !== notaId);

  salvarNotas(notas); // Salva as notas atualizadas no arquivo JSON
  res.redirect('/list_notes'); // Redireciona para a lista de notas
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
