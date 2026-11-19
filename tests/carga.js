import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Sobe até 10 usuários simultâneos (Carga)
    { duration: '15s', target: 30 }, // Puxa para 30 usuários simultâneos (Estresse)
    { duration: '5s', target: 0 },   // Desacelera para 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Exige menos de 1% de falhas
    http_req_duration: ['p(95)<500'], // 95% das requisições devem responder em menos de 500ms
  },
};

const BASE = 'http://localhost:3000/api';


export function setup() {
  const user = `k6carga${Date.now()}`;
  const cad = http.post(`${BASE}/cadastro`, JSON.stringify({
    nome: 'Usuario Carga',
    dataNascimento: '2000-01-01',
    user,
    email: `${user}@teste.com`,
    senha: '123456',
    confirmarSenha: '123456'
  }), { headers: { 'Content-Type': 'application/json' } });

  check(cad, { 'cadastro retornou 201': (r) => r.status === 201 });
  return { usuarioId: cad.json('id') };
}


export default function (data) {
  const res = http.get(`${BASE}/treinos?usuarioId=${data.usuarioId}`);

  check(res, {
    'Status 200 OK': (r) => r.status === 200,
  });

  sleep(0.5);
}