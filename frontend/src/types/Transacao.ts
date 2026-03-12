export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: number;
  pessoaNome: string;
  categoriaId: number;
  categoriaDescricao: string;
}