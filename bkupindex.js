// src/index.js
const express = require('express');
const path = require('path');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { lerNotas, salvarNotas } = require('./notes'); // Importando as funções
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
app.use(express.urlencoded({ extended: true })); // Já está configurado, mas verifique
app.use(express.json()); // Adiciona suporte ao corpo JSON


// Configuração para arquivos estáticos (como imagens, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true })); // Para processar dados do formulário

// Configuração do mecanismo de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Rota para o dashboard
app.get('/', (req, res) => {
  res.render('dashboard');
});

// Rota para exibir a lista de páginas
app.get('/list', (req, res) => {
  res.render('list');
});

// Rota para exibir as notas
app.get('/notes', (req, res) => {
  res.render('notes');
});

// Rota para links
app.get('/links', (req, res) => {
  res.render('links');
});

// Rota para exibir todas as notas
app.get('/list_notes', (req, res) => {
  const notas = lerNotas(); // Lê as notas do arquivo
  res.render('list_notes', { notas }); // Passa as notas para a visualização
});

app.get('/chat', (req, res) => {
  res.render('chat')
});

io.on('connection', (socket) => {
  console.log('Um usuário se conectou');
  // Adicione os eventos aqui
  socket.on('disconnect', () => {
      console.log('Usuário desconectado');
  });
});

// Rota para adicionar uma nova nota
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

  res.redirect('/list_notes'); // Redireciona para a página principal
});

// Rota para excluir uma nota
app.post('/delete-note/:id', (req, res) => {
  const notaId = req.params.id;  // Pega o ID da nota da URL
  let notas = lerNotas();  // Lê as notas existentes

  // Filtra as notas, removendo a nota com o ID correspondente
  notas = notas.filter(nota => nota.id !== notaId);

  salvarNotas(notas);  // Salva as notas atualizadas no arquivo JSON

  res.redirect('/list_notes');  // Redireciona para a lista de notas
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
