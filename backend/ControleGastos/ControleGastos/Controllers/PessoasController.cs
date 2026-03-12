using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        // Lista todas as pessoas cadastradas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> Get()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        // Busca uma pessoa pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> GetById(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
                return NotFound("Pessoa não encontrada.");

            return Ok(pessoa);
        }

        // Cria uma nova pessoa
        [HttpPost]
        public async Task<ActionResult<Pessoa>> Post(Pessoa pessoa)
        {
            // Validação do nome
            if (string.IsNullOrWhiteSpace(pessoa.Nome))
                return BadRequest("O nome é obrigatório.");

            if (pessoa.Nome.Length > 200)
                return BadRequest("O nome deve ter no máximo 200 caracteres.");

            // Validação  da idade
            if (pessoa.Idade < 0)
                return BadRequest("A idade não pode ser negativa.");

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = pessoa.Id }, pessoa);
        }

        // Atualiza uma pessoa existente
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, Pessoa pessoa)
        {
            if (id != pessoa.Id)
                return BadRequest("O ID da URL é diferente do ID enviado.");

            if (string.IsNullOrWhiteSpace(pessoa.Nome))
                return BadRequest("O nome é obrigatório.");

            if (pessoa.Nome.Length > 200)
                return BadRequest("O nome deve ter no máximo 200 caracteres.");

            if (pessoa.Idade < 0)
                return BadRequest("A idade não pode ser negativa.");

            var pessoaExiste = await _context.Pessoas.AnyAsync(p => p.Id == id);

            if (!pessoaExiste)
                return NotFound("Pessoa não encontrada.");

            _context.Pessoas.Update(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Exclui uma pessoa
        // as transações ligadas a essa pessoa serão apagadas também.
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
                return NotFound("Pessoa não encontrada.");

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}