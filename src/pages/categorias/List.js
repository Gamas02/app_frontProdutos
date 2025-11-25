import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Categorias() {
  const [categorias, setCategoria] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4567/categorias");

      if (!response.ok) throw new Error(`Erro na rede: ${response.status}`);

      const data = await response.json();
      setCategoria(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const deleteCategoria = async (id) => {
    try {
      const response = await fetch(`http://localhost:4567/categorias/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar produto");

      setCategoria(categorias.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="title">Lista de Categorias</h1>

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : categorias.length === 0 ? (
        <p className="empty">Nenhuma categoria encontrada</p>
      ) : (
        <div className="card-list">
          {categorias.map((categoria) => (
            <div className="categoria-card" key={categoria.id}>
              <div className="categoria-info">
                <h3>{categoria.nome}</h3>
              </div>

              <div className="actions">
                <button
                  className="btn edit"
                  onClick={() => navigate(`/edit/${categoria.id}`)}
                >
                  Editar
                </button>

                <button
                  className="btn delete"
                  onClick={() => deleteCategoria(categoria.id)}
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
