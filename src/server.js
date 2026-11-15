import express from 'express';
import { sequelize, Treino, Serie } from './database.js';

const app = express();
const PORTA = 3000;

// Permite que o servidor leia JSON no corpo das requisições e sirva a pasta public
app.use(express.json());
app.use(express.static('public'));

// Rota 1: Listar todos os treinos com as suas séries
app.get('/api/treinos', async (req, res) => {
  try {
    const treinos = await Treino.findAll({
      include: { model: Serie, as: 'series' },
      order: [['id', 'DESC']]
    });
    res.json(treinos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os treinos.' });
  }
});

// Rota 2: Criar um novo treino (e as séries, se existirem)
app.post('/api/treinos', async (req, res) => {
  try {
    const { nome, tipo, duracao, distancia, series } = req.body;

    if (!nome || !tipo) {
      return res.status(400).json({ erro: 'Nome e tipo do exercício são obrigatórios.' });
    }

    const novoTreino = await Treino.create(
      {
        nome,
        tipo,
        duracao: duracao ? Number(duracao) : null,
        distancia: distancia ? Number(distancia) : null,
        series: series || []
      },
      {
        include: [{ model: Serie, as: 'series' }]
      }
    );

    res.status(201).json(novoTreino);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao guardar o treino na base de dados.' });
  }
});

// Rota 3: Excluir um treino pelo ID
app.delete('/api/treinos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const apagados = await Treino.destroy({ where: { id } });

    if (!apagados) {
      return res.status(404).json({ erro: 'Treino não encontrado.' });
    }

    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir o treino.' });
  }
});

// Sincroniza a base de dados e inicia o servidor
sequelize.sync().then(() => {
  app.listen(PORTA, () => {
    console.log(`Servidor ativo em http://localhost:${PORTA}`);
  });
});
