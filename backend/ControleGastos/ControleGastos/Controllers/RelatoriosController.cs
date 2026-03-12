using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        // Lista os totais de receitas, despesas e saldo por pessoa
        [HttpGet("totais-por-pessoa")]
        public async Task<ActionResult<ResumoTotaisPorPessoaDto>> GetTotaisPorPessoa()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .Select(p => new TotalPorPessoaDto
                { //soma todas transcoes de receitas/despesas da pessoa
                    PessoaId = p.Id,
                    Nome = p.Nome,
                    TotalReceitas = p.Transacoes
                        .Where(t => t.Tipo == "Receita")
                        .Sum(t => (decimal?)t.Valor) ?? 0,

                    TotalDespesas = p.Transacoes
                        .Where(t => t.Tipo == "Despesa")
                        .Sum(t => (decimal?)t.Valor) ?? 0
                })
                .ToListAsync();

            foreach (var pessoa in pessoas)
            {
                pessoa.Saldo = pessoa.TotalReceitas - pessoa.TotalDespesas;
            }

            var resposta = new ResumoTotaisPorPessoaDto
            { //Resultado das Receitas - Despesas = Lucro ou Prejuizo
                Pessoas = pessoas,
                TotalGeralReceitas = pessoas.Sum(p => p.TotalReceitas),
                TotalGeralDespesas = pessoas.Sum(p => p.TotalDespesas)
            };

            //Lucro ou Prejuizo
            resposta.SaldoLiquidoGeral = resposta.TotalGeralReceitas - resposta.TotalGeralDespesas;

            return Ok(resposta);
        }
    }
}