namespace ControleGastos.Api.Models
{
    public class Transacao
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        public string Tipo { get; set; } = string.Empty;

        public int PessoaId { get; set; }

        public int CategoriaId { get; set; }

        // Cada transação pertence a uma pessoa
        public Pessoa? Pessoa { get; set; }

        // Cada transação usa uma categoria
        public Categoria? Categoria { get; set; }
    }
}