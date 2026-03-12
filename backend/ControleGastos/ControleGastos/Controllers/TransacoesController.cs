using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        //lista todas as transações cadastradas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> Get()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .Select(t => new
                {
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.PessoaId,
                    PessoaNome = t.Pessoa != null ? t.Pessoa.Nome : null,
                    t.CategoriaId,
                    CategoriaDescricao = t.Categoria != null ? t.Categoria.Descricao : null
                })
                .ToListAsync();

            return Ok(transacoes);
        }

        // Cria uma nova transacao
        [HttpPost]
        public async Task<ActionResult> Post(CriarTransacaoDto dto)
        {
            //validacoes
            if (string.IsNullOrWhiteSpace(dto.Descricao))
                return BadRequest("A descrição é obrigatória.");

            if (dto.Descricao.Length > 400)
                return BadRequest("A descrição deve ter no máximo 400 caracteres.");

            if (dto.Valor <= 0)
                return BadRequest("O valor deve ser um número positivo.");

            var tiposValidos = new[] { "Despesa", "Receita" };

            if (string.IsNullOrWhiteSpace(dto.Tipo))
                return BadRequest("O tipo é obrigatório.");

            if (!tiposValidos.Contains(dto.Tipo))
                return BadRequest("O tipo deve ser Despesa ou Receita.");

            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
            if (pessoa == null)
                return BadRequest("A pessoa informada não existe.");

            var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
            if (categoria == null)
                return BadRequest("A categoria informada não existe.");

            // menor de idade só pode ter despesa
            if (pessoa.Idade < 18 && dto.Tipo == "Receita")
                return BadRequest("Menores de idade só podem ter transações do tipo Despesa.");

            // a categoria deve ser compativel com o tipo da transação
            bool categoriaCompativel =
                categoria.Finalidade == "Ambas" ||
                categoria.Finalidade == dto.Tipo;

            if (!categoriaCompativel)
                return BadRequest("A categoria escolhida não é compatível com o tipo da transação.");

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                PessoaId = dto.PessoaId,
                CategoriaId = dto.CategoriaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Mensagem = "Transação criada com sucesso.",
                TransacaoId = transacao.Id
            });
        }
    }
}