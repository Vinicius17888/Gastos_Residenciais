import { useEffect, useState } from "react";
import "./App.css";
import type { Pessoa } from "./types/Pessoa";
import type { Categoria } from "./types/Categoria";
import type { Transacao } from "./types/Transacao";
import type { ResumoTotaisPorPessoa } from "./types/Relatorio";
import {
  atualizarPessoa,
  criarCategoria,
  criarPessoa,
  criarTransacao,
  excluirPessoa,
  getCategorias,
  getPessoas,
  getTotaisPorPessoa,
  getTransacoes,
} from "./services/api";

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [relatorio, setRelatorio] = useState<ResumoTotaisPorPessoa | null>(null);

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [finalidade, setFinalidade] = useState("Despesa");

  const [descricaoTransacao, setDescricaoTransacao] = useState("");
  const [valorTransacao, setValorTransacao] = useState("");
  const [tipoTransacao, setTipoTransacao] = useState("Despesa");
  const [pessoaIdTransacao, setPessoaIdTransacao] = useState("");
  const [categoriaIdTransacao, setCategoriaIdTransacao] = useState("");

  const [carregando, setCarregando] = useState(false);

  const [mensagemPessoa, setMensagemPessoa] = useState("");
  const [mensagemCategoria, setMensagemCategoria] = useState("");
  const [mensagemTransacao, setMensagemTransacao] = useState("");
  const [mensagemRelatorio, setMensagemRelatorio] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarPessoas() {
    const dados = await getPessoas();
    setPessoas(dados);
  }

  async function carregarCategorias() {
    const dados = await getCategorias();
    setCategorias(dados);
  }

  async function carregarTransacoes() {
    const dados = await getTransacoes();
    setTransacoes(dados);
  }

  async function carregarRelatorio() {
    const dados = await getTotaisPorPessoa();
    setRelatorio(dados);
  }

  async function carregarTudo() {
    try {
      setCarregando(true);
      setMensagemRelatorio("");
      await carregarPessoas();
      await carregarCategorias();
      await carregarTransacoes();
      await carregarRelatorio();
    } catch (error) {
      console.error(error);
      setMensagemPessoa("Erro ao carregar dados.");
      setMensagemRelatorio("Erro ao carregar relatório.");
    } finally {
      setCarregando(false);
    }
  }

  function limparFormularioPessoa() {
    setNome("");
    setIdade("");
    setEditandoId(null);
  }

  function preencherParaEdicao(pessoa: Pessoa) {
    setNome(pessoa.nome);
    setIdade(String(pessoa.idade));
    setEditandoId(pessoa.id);
    setMensagemPessoa("");
  }

  async function handleSubmitPessoa(event: React.FormEvent) {
    event.preventDefault();
    setMensagemPessoa("");

    if (!nome.trim()) {
      setMensagemPessoa("Informe o nome.");
      return;
    }

    if (!idade || Number(idade) < 0) {
      setMensagemPessoa("Informe uma idade válida.");
      return;
    }

    try {
      if (editandoId === null) {
        await criarPessoa(nome, Number(idade));
        setMensagemPessoa("Pessoa cadastrada com sucesso.");
      } else {
        await atualizarPessoa(editandoId, nome, Number(idade));
        setMensagemPessoa("Pessoa atualizada com sucesso.");
      }

      limparFormularioPessoa();
      await carregarPessoas();
      await carregarRelatorio();
    } catch (error) {
      console.error(error);
      setMensagemPessoa("Erro ao salvar pessoa.");
    }
  }

  async function handleExcluirPessoa(id: number) {
    const confirmou = window.confirm("Deseja realmente excluir esta pessoa?");
    if (!confirmou) return;

    try {
      await excluirPessoa(id);
      setMensagemPessoa("Pessoa excluída com sucesso.");

      if (editandoId === id) {
        limparFormularioPessoa();
      }

      await carregarPessoas();
      await carregarTransacoes();
      await carregarRelatorio();
    } catch (error) {
      console.error(error);
      setMensagemPessoa("Erro ao excluir pessoa.");
    }
  }

  async function handleSubmitCategoria(event: React.FormEvent) {
    event.preventDefault();
    setMensagemCategoria("");

    if (!descricaoCategoria.trim()) {
      setMensagemCategoria("Informe a descrição da categoria.");
      return;
    }

    try {
      await criarCategoria(descricaoCategoria, finalidade);
      setMensagemCategoria("Categoria cadastrada com sucesso.");
      setDescricaoCategoria("");
      setFinalidade("Despesa");
      await carregarCategorias();
    } catch (error) {
      console.error(error);
      setMensagemCategoria("Erro ao cadastrar categoria.");
    }
  }

  async function handleSubmitTransacao(event: React.FormEvent) {
    event.preventDefault();
    setMensagemTransacao("");

    if (!descricaoTransacao.trim()) {
      setMensagemTransacao("Informe a descrição da transação.");
      return;
    }

    if (!valorTransacao || Number(valorTransacao) <= 0) {
      setMensagemTransacao("Informe um valor positivo.");
      return;
    }

    if (!pessoaIdTransacao) {
      setMensagemTransacao("Selecione uma pessoa.");
      return;
    }

    if (!categoriaIdTransacao) {
      setMensagemTransacao("Selecione uma categoria.");
      return;
    }

    const pessoaSelecionada = pessoas.find(
      (p) => p.id === Number(pessoaIdTransacao)
    );

    if (pessoaSelecionada && pessoaSelecionada.idade < 18 && tipoTransacao === "Receita") {
      setMensagemTransacao("Menores de idade só podem ter despesa.");
      return;
    }

    try {
      await criarTransacao(
        descricaoTransacao,
        Number(valorTransacao),
        tipoTransacao,
        Number(categoriaIdTransacao),
        Number(pessoaIdTransacao)
      );

      setMensagemTransacao("Transação cadastrada com sucesso.");
      setDescricaoTransacao("");
      setValorTransacao("");
      setTipoTransacao("Despesa");
      setPessoaIdTransacao("");
      setCategoriaIdTransacao("");

      await carregarTransacoes();
      await carregarRelatorio();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setMensagemTransacao(error.message);
      } else {
        setMensagemTransacao("Erro ao cadastrar transação.");
      }
    }
  }

  const pessoaSelecionada = pessoas.find(
    (p) => p.id === Number(pessoaIdTransacao)
  );
  
// Filtra apenas categorias compatíveis com o tipo da transação selecionada
  const categoriasCompativeis = categorias.filter(
    (categoria) =>
      categoria.finalidade === "Ambas" || categoria.finalidade === tipoTransacao
  );

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <div className="container">
      <h1>Controle de Gastos</h1>

      <h2>{editandoId === null ? "Cadastro de Pessoas" : "Edição de Pessoa"}</h2>

      <form onSubmit={handleSubmitPessoa} className="formulario">
        <div className="campo">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="campo">
          <label>Idade</label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            min={0}
          />
        </div>

        <button type="submit">
          {editandoId === null ? "Cadastrar" : "Salvar"}
        </button>

        {editandoId !== null && (
          <button type="button" onClick={limparFormularioPessoa}>
            Cancelar
          </button>
        )}
      </form>

      {mensagemPessoa && <p className="mensagem">{mensagemPessoa}</p>}

      <h2>Lista de Pessoas</h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : pessoas.length === 0 ? (
        <p>Nenhuma pessoa cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.id}</td>
                <td>{pessoa.nome}</td>
                <td>{pessoa.idade}</td>
                <td>
                  <div className="acoes">
                    <button
                      type="button"
                      onClick={() => preencherParaEdicao(pessoa)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExcluirPessoa(pessoa.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <h2>Cadastro de Categorias</h2>

      <form onSubmit={handleSubmitCategoria} className="formulario">
        <div className="campo">
          <label>Descrição</label>
          <input
            type="text"
            value={descricaoCategoria}
            onChange={(e) => setDescricaoCategoria(e.target.value)}
            maxLength={400}
          />
        </div>

        <div className="campo">
          <label>Finalidade</label>
          <select
            value={finalidade}
            onChange={(e) => setFinalidade(e.target.value)}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Ambas">Ambas</option>
          </select>
        </div>

        <button type="submit">Cadastrar Categoria</button>
      </form>

      {mensagemCategoria && <p className="mensagem">{mensagemCategoria}</p>}

      <h2>Lista de Categorias</h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Finalidade</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.descricao}</td>
                <td>{categoria.finalidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <h2>Cadastro de Transações</h2>

      <form onSubmit={handleSubmitTransacao} className="formulario">
        <div className="campo">
          <label>Descrição</label>
          <input
            type="text"
            value={descricaoTransacao}
            onChange={(e) => setDescricaoTransacao(e.target.value)}
            maxLength={400}
          />
        </div>

        <div className="campo">
          <label>Valor</label>
          <input
            type="number"
            value={valorTransacao}
            onChange={(e) => setValorTransacao(e.target.value)}
            min={0}
            step="0.01"
          />
        </div>

        <div className="campo">
          <label>Pessoa</label>
          <select
            value={pessoaIdTransacao}
            onChange={(e) => {
              const novoId = e.target.value;
              setPessoaIdTransacao(novoId);

              const pessoa = pessoas.find((p) => p.id === Number(novoId));
              if (pessoa && pessoa.idade < 18) {
                setTipoTransacao("Despesa");
              }

              setCategoriaIdTransacao("");
            }}
          >
            <option value="">Selecione</option>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome} ({pessoa.idade} anos)
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Tipo</label>
          <select
            value={tipoTransacao}
            onChange={(e) => {
              setTipoTransacao(e.target.value);
              setCategoriaIdTransacao("");
            }}
          >
            <option value="Despesa">Despesa</option>
            {(!pessoaSelecionada || pessoaSelecionada.idade >= 18) && (
              <option value="Receita">Receita</option>
            )}
          </select>
        </div>

        <div className="campo">
          <label>Categoria</label>
          <select
            value={categoriaIdTransacao}
            onChange={(e) => setCategoriaIdTransacao(e.target.value)}
          >
            <option value="">Selecione</option>
            {categoriasCompativeis.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.descricao} ({categoria.finalidade})
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Cadastrar Transação</button>
      </form>

      {mensagemTransacao && <p className="mensagem">{mensagemTransacao}</p>}

      <h2>Lista de Transações</h2>

      {carregando ? (
        <p>Carregando...</p>
      ) : transacoes.length === 0 ? (
        <p>Nenhuma transação cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Pessoa</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td>{transacao.id}</td>
                <td>{transacao.descricao}</td>
                <td>{transacao.valor}</td>
                <td>{transacao.tipo}</td>
                <td>{transacao.pessoaNome}</td>
                <td>{transacao.categoriaDescricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <h2>Relatório de Totais por Pessoa</h2>

      {mensagemRelatorio && <p className="mensagem">{mensagemRelatorio}</p>}

      {carregando ? (
        <p>Carregando...</p>
      ) : !relatorio || relatorio.pessoas.length === 0 ? (
        <p>Nenhum dado disponível para o relatório.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Total de Receitas</th>
                <th>Total de Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.pessoas.map((item) => (
                <tr key={item.pessoaId}>
                  <td>{item.nome}</td>
                  <td>R$ {item.totalReceitas.toFixed(2)}</td>
                  <td>R$ {item.totalDespesas.toFixed(2)}</td>
                  <td>R$ {item.saldo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="resumo-geral">
            <p><strong>Total Geral de Receitas:</strong> R$ {relatorio.totalGeralReceitas.toFixed(2)}</p>
            <p><strong>Total Geral de Despesas:</strong> R$ {relatorio.totalGeralDespesas.toFixed(2)}</p>
            <p><strong>Saldo Líquido Geral:</strong> R$ {relatorio.saldoLiquidoGeral.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;