const BASE_URL = "https://localhost:7284/api"; //back end

export async function getPessoas() { //nuscar pessoas
  const response = await fetch(`${BASE_URL}/Pessoas`);

  if (!response.ok) {
    throw new Error("Erro ao buscar pessoas.");
  }

  return response.json();
}

export async function criarPessoa(nome: string, idade: number) {//criar
  const response = await fetch(`${BASE_URL}/Pessoas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 0,
      nome,
      idade,
      transacoes: [],
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || "Erro ao criar pessoa.");
  }

  return response.json();
}

//atualizar existente
export async function atualizarPessoa(id: number, nome: string, idade: number) {
  const response = await fetch(`${BASE_URL}/Pessoas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      nome,
      idade,
      transacoes: [],
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || "Erro ao atualizar pessoa.");
  }
}

//delete
export async function excluirPessoa(id: number) {
  const response = await fetch(`${BASE_URL}/Pessoas/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || "Erro ao excluir pessoa.");
  }

  
}

//listar
export async function getCategorias() {
  const response = await fetch(`${BASE_URL}/Categorias`);

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias.");
  }

  return response.json();
}

//criar
export async function criarCategoria(descricao: string, finalidade: string) {
  const response = await fetch(`${BASE_URL}/Categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 0,
      descricao,
      finalidade,
      transacoes: [],
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || "Erro ao criar categoria.");
  }

  return response.json();
}

//lista/busca
export async function getTransacoes() {
  const response = await fetch(`${BASE_URL}/Transacoes`);

  if (!response.ok) {
    throw new Error("Erro ao buscar transações.");
  }

  return response.json();
}

export async function criarTransacao(
  descricao: string,
  valor: number,
  tipo: string,
  categoriaId: number,
  pessoaId: number
) { //Ja faz a listagem ao criar a transacao
  const response = await fetch(`${BASE_URL}/Transacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao,
      valor,
      tipo,
      categoriaId,
      pessoaId,
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || "Erro ao criar transação.");
  }

  return response.json();
}

//Buscar relatorio total da pessoa
export async function getTotaisPorPessoa() {
  const response = await fetch(`${BASE_URL}/Relatorios/totais-por-pessoa`);

  if (!response.ok) {
    throw new Error("Erro ao buscar relatório.");
  }

  return response.json();
}