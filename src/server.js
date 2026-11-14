import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Gerenciador de Tarefas funcionando!');
});

//Nossa primeira lista de tarefas
const tarefas = [
    {id: 1, titulo: 'Estudar JavaScript', concluida: false},
    {id: 2, titulo: 'Aprender Node.js', concluida: false},
    {id: 3, titulo: 'Criar meu primeiro servidor', concluida: true},
];

app.post('/Tarefas', (req, res) => {
    const novaTarefa = {
        id: Tarefas.length + 1,
        titulo: req.body.titulo,
        concluida: false
    };
    Tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);   
    });

//Rota para atualizar uma tarefa
app.put('/Tarefas/:id', (req, res) => {
    const Id = Number(req.params.id);
    const Tarefa = Tarefas.find((item) => item.id === Id);
    
    if (!Tarefa) {
       return res.status(404).json({
        mensagem: 'Tarefa não encontrada'
         });
     }

     Tarefa.titulo = req.body.titulo;

     res.json(Tarefa);
       });
//Rota para consultar todas as tarefas
app.get('/Tarefas', (req, res) => {
    res.json(Tarefas);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
}); 