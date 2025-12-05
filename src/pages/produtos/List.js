import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Produtos() {
  const [produtos, setProduto] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4567/produtos");

      if (!response.ok) throw new Error(`Erro na rede: ${response.status}`);

      const data = await response.json();
      setProduto(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const deleteProduto = async (id) => {
    try {
      const response = await fetch(`http://localhost:4567/produtos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar produto");

      setProduto(produtos.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="title">Lista de Produtos</h1>

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : produtos.length === 0 ? (
        <p className="empty">Nenhum produto encontrado</p>
      ) : (
        <div className="card-list">
          {produtos.map((produto) => (
            <div className="produto-card" key={produto.id}>
              <div className="produto-info">
                <h3>{produto.nome}</h3>
                <p>Preço: R$ {produto.preco}</p>
                <p>Estoque: {produto.estoque}</p>
                <p>Categoria: {produto.categoria ? produto.categoria.nome : "Sem categoria"}</p>
              </div>

              <div className="actions">
                <button
                  className="btn edit"
                  onClick={() => navigate(`/produtos/edit/${produto.id}`)}
                >
                  Editar
                </button>

                <button
                  className="btn delete"
                  onClick={() => deleteProduto(produto.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
