using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // Listar todas as categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> Get()
        {
            var categorias = await _context.Categorias.ToListAsync();
            return Ok(categorias);
        }

        // Criar uma nova categoria
        [HttpPost]
        public async Task<ActionResult<Categoria>> Post(Categoria categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Descricao))
                return BadRequest("A descrição é obrigatória.");

            if (categoria.Descricao.Length > 400)
                return BadRequest("A descrição deve ter no máximo 400 caracteres.");

            var finalidadesValidas = new[] { "Despesa", "Receita", "Ambas" };

            if (string.IsNullOrWhiteSpace(categoria.Finalidade))
                return BadRequest("A finalidade é obrigatória.");

            if (!finalidadesValidas.Contains(categoria.Finalidade))
                return BadRequest("A finalidade deve ser Despesa, Receita ou Ambas.");

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = categoria.Id }, categoria);
        }
    }
}