const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware para CORS
app.use(cors({
    origin: 'http://localhost:3001', // Permitir requisições do front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para analisar JSON
app.use(express.json());

// Simulação de banco de dados
const academias = [
    { id: 1, nome: "Academia 1", telefone: "123456789" },
    { id: 2, nome: "Academia 2", telefone: "987654321" }
];

const estilos = [
    { id: 1, nome: "Monstrão" },
    { id: 2, nome: "Frango" },
    { id: 3, nome: "Chassi de Grilo" },
    { id: 4, nome: "Esquelético" }
];

let clientes = [];

// Classe BodyBuilder
class BodyBuilder {
    constructor(cpf, nome, peso, altura, idade, estiloNome, academia) {
        this.cpf = cpf;
        this.nome = nome;
        this.peso = peso;
        this.altura = altura;
        this.idade = idade;
        this.estiloNome = estiloNome;
        this.academia = academia;
    }
}


app.post('/clientes', (req, res) => {
  const data = req.body;

  // Validação de campos obrigatórios
  if (!data.cpf || !data.nome || !data.peso || !data.altura || !data.idade || !data.idEstilo || !data.idAcademia) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  const gym = academias.find(g => g.id == data.idAcademia);
  const estilo = estilos.find(e => e.id == data.idEstilo);

  if (!gym || !estilo) {
      return res.status(404).json({ erro: "Academia ou Estilo não encontrado" });
  }

  const cliente = {
      cpf: data.cpf,
      nome: data.nome,
      peso: data.peso,
      altura: data.altura,
      idade: data.idade,
      estiloNome: estilo.nome,
      academia: gym
  };

  clientes.push(cliente);

  res.status(201).json(cliente);
});

// Rota para criar um novo BodyBuilder
app.post('/body-builder', (req, res) => {
    const data = req.body;

    // Validação de dados
    if (!data.cpf || !data.nome || !data.peso || !data.altura || !data.idade || !data.idEstilo || !data.idAcademia) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const gym = academias.find(gym => gym.id == data.idAcademia);
    const estilo = estilos.find(estilo => estilo.id == data.idEstilo);

    if (!gym || !estilo) {
        return res.status(404).json({ erro: "Academia ou Estilo não encontrado" });
    }

    const bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.idade, estilo.nome, gym);
    clientes.push(bodyBuilder);

    res.status(201).json(bodyBuilder);
});

// Rota para atualizar um BodyBuilder
app.put('/body-builder/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const data = req.body;

    const clienteIndex = clientes.findIndex(cliente => cliente.cpf === cpf);

    if (clienteIndex === -1) {
        return res.status(404).json({ erro: "Body Builder não encontrado" });
    }

    const gym = academias.find(gym => gym.id == data.idAcademia);
    const estilo = estilos.find(estilo => estilo.id == data.idEstilo);

    if (!gym || !estilo) {
        return res.status(404).json({ erro: "Academia ou Estilo não encontrado" });
    }

    const bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.idade, estilo.nome, gym);
    clientes[clienteIndex] = bodyBuilder;

    res.json(bodyBuilder);
});

// Rota para excluir um BodyBuilder
app.delete("/body-builder/:cpf", (req, res) => {
    const cpf = req.params.cpf;
    const clienteIndex = clientes.findIndex(cliente => cliente.cpf === cpf);

    if (clienteIndex === -1) {
        return res.status(404).json({ erro: "Body Builder não encontrado" });
    }

    clientes.splice(clienteIndex, 1);
    res.send("Body Builder deletado com sucesso");
});

// Rota para buscar clientes
app.get('/body-builder', (req, res) => {
    const busca = req.query.busca;

    const clientesFiltrados = busca
        ? clientes.filter(cliente =>
            cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
            cliente.cpf.toLowerCase().includes(busca.toLowerCase())
        )
        : clientes;

    res.json(clientesFiltrados);
});

// Rota para buscar academias
app.get('/gym', (req, res) => {
    res.json(academias);
});

// Rota para buscar estilos
app.get('/estilo', (req, res) => {
    res.json(estilos);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
