namespace ControleGastos.Api.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public string Finalidade { get; set; } = string.Empty;

        // Uma categoria - várias transações
        public List<Transacao> Transacoes { get; set; } = new();
    }
}