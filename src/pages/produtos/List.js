import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Produtos() {
  const [users, setProduto] = useState([]);
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
      const response = await fetch(`http://localhost:3000/produtos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar produto");

      setProduto(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="title">Lista de Produtos</h1>

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : users.length === 0 ? (
        <p className="empty">Nenhum produto encontrado</p>
      ) : (
        <div className="card-list">
          {users.map((user) => (
            <div className="produto-card" key={user.id}>
              <div className="produto-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>

              <div className="actions">
                <button
                  className="btn edit"
                  onClick={() => navigate(`/edit/${user.id}`)}
                >
                  Editar
                </button>

                <button
                  className="btn delete"
                  onClick={() => deleteProduto(user.id)}
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
