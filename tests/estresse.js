import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },   // aquecimento: sobe para 20 usuários
    { duration: '20s', target: 50 },   // carga alta: 50 usuários
    { duration: '20s', target: 100 },  // estresse: 100 usuários
    { duration: '20s', target: 150 },  // limite: 150 usuários
    { duration: '10s', target: 0 },    // recuperação: desce para 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],    // tolera até 5% de falhas
    http_req_duration: ['p(95)<1500'], // 95% das respostas em menos de 1,5s
  },
};

const BASE = 'http://localhost:3000/api';
const JSON_HEADERS = { headers: { 'Content-Type': 'application/json' } };

// Roda uma vez antes do teste: cria um usuário
export function setup() {
  const user = `k6estresse${Date.now()}`;
  const cad = http.post(`${BASE}/cadastro`, JSON.stringify({
    nome: 'Usuario Estresse',
    dataNascimento: '2000-01-01',
    user,
    email: `${user}@teste.com`,
    senha: '123456',
    confirmarSenha: '123456'
  }), JSON_HEADERS);

  check(cad, { 'cadastro retornou 201': (r) => r.status === 201 });
  return { usuarioId: cad.json('id') };
}

export default function (data) {
  // 1. Criar treino (escrita no banco)
  const resPost = http.post(`${BASE}/treinos`, JSON.stringify({
    nome: 'Supino Reto k6',
    tipo: 'musculacao',
    series: [{ repeticoes: 12, carga: 30 }],
    usuarioId: data.usuarioId
  }), JSON_HEADERS);

  check(resPost, { 'POST status é 201': (r) => r.status === 201 });

  // só lê o id se o POST deu certo (evita erro quando o servidor está sobrecarregado)
  const idCriado = resPost.status === 201 ? resPost.json('id') : null;

  // 2. Listar treinos (leitura do banco)
  const resGet = http.get(`${BASE}/treinos?usuarioId=${data.usuarioId}`);
  check(resGet, { 'GET status é 200': (r) => r.status === 200 });

  // 3. Excluir o treino criado (escrita no banco)
  if (idCriado) {
    const resDel = http.del(`${BASE}/treinos/${idCriado}`);
    check(resDel, { 'DELETE status é 204': (r) => r.status === 204 });
  }

  sleep(0.3);
}