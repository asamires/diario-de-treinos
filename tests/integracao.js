import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 5, // Executa o ciclo completo 5 vezes seguidas
};

const BASE_URL = 'http://localhost:3000/api/treinos';
const URL_CADASTRO = 'http://localhost:3000/api/cadastro';

// MUDANÇA 2: setup() cria um usuário de teste
export function setup() {
  const user = `k6user${Date.now()}`;
  const cad = http.post(URL_CADASTRO, JSON.stringify({
    nome: 'Usuario Teste',
    dataNascimento: '2000-01-01',
    user: user,
    email: `${user}@teste.com`,
    senha: '123456',
    confirmarSenha: '123456'
  }), { headers: { 'Content-Type': 'application/json' } });

  return { usuarioId: cad.json('id') };
}

// MUDANÇA 3: a função recebe (data)
export default function (data) {
  // 1. Criar treino (POST)
  const payload = JSON.stringify({
    nome: 'Supino Reto k6',
    tipo: 'musculacao',
    series: [{ repeticoes: 12, carga: 30 }],
    usuarioId: data.usuarioId   // MUDANÇA 4a: dono do treino
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  const resPost = http.post(BASE_URL, payload, params);

  check(resPost, {
    'POST status é 201': (r) => r.status === 201,
    'Retornou ID do banco': (r) => r.json('id') !== undefined,
  });

  const idCriado = resPost.json('id');
  sleep(0.5);

  // 2. Listar treinos (GET)
  const resGet = http.get(`${BASE_URL}?usuarioId=${data.usuarioId}`); // MUDANÇA 4b
  check(resGet, {
    'GET status é 200': (r) => r.status === 200,
    'Lista não está vazia': (r) => r.json().length > 0,
  });

  sleep(0.5);

  // 3. Excluir o treino criado (DELETE) — sem mudanças
  if (idCriado) {
    const resDel = http.del(`${BASE_URL}/${idCriado}`);
    check(resDel, {
      'DELETE status é 204': (r) => r.status === 204,
    });
  }
}