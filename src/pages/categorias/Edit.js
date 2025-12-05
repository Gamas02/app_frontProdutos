import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CategoriasEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4567/categorias/${id}`
        );
        if (!response.ok) throw new Error();

        const data = await response.json();
        setName(data.nome || "");
      } catch (error) {
        console.error("Erro ao carregar categoria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4567/categorias/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number(id),
            nome: name
          }),
        }
      );

      if (!response.ok) throw new Error();

      navigate("/categorias");
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
    }
  };

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="page-container">
      <h1 className="title">Editar Categoria</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button className="btn edit" type="submit">
          Salvar
        </button>

        <button
          type="button"
          className="btn delete"
          onClick={() => navigate("/categorias")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
