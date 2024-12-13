const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para analisar JSON
app.use(express.json());

let clientes = [];

app.post('/body-builder', (req, res) => {
    const data = req.body;
    console.log('Dados recebidos:', data); // Exibe os dados recebidos no console

    // Simula a criação de um novo body builder
    let novoBodyBuilder = {
        cpf: data.cpf,
        nome: data.nome,
        peso: data.peso,
        altura: data.altura,
        idade: data.idade
    };

    clientes.push(novoBodyBuilder); // Adiciona no banco de dados simulado

    // Retorna o cliente recém-criado
    return res.status(201).json(novoBodyBuilder); // Responde com o novo body builder
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
