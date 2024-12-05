// src/index.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para arquivos estáticos (como imagens, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
  res.render('dashboard');
});


app.get('/lista', (req, res) => {
  res.render('lista');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
