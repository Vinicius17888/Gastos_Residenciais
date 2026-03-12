namespace ControleGastos.Api.DTOs
{
    public class CriarTransacaoDto
    {
        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        public string Tipo { get; set; } = string.Empty;

        public int CategoriaId { get; set; }

        public int PessoaId { get; set; }
    }
}