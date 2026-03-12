namespace ControleGastos.Api.DTOs
{
    public class ResumoTotaisPorPessoaDto
    {
        public List<TotalPorPessoaDto> Pessoas { get; set; } = new();

        public decimal TotalGeralReceitas { get; set; }

        public decimal TotalGeralDespesas { get; set; }

        public decimal SaldoLiquidoGeral { get; set; }
    }
}