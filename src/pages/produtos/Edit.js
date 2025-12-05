import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProdutosEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:4567/produtos/${id}`
        );
        if (!productResponse.ok) throw new Error();

        const productData = await productResponse.json();

        setName(productData.nome || "");
        setPreco(productData.preco || "");
        setEstoque(productData.estoque || "");
        setCategoria(productData.categoria?.id || "");

        const categoriesResponse = await fetch(
          "http://localhost:4567/categorias"
        );
        if (!categoriesResponse.ok) throw new Error();

        const categoriesData = await categoriesResponse.json();
        setCategorias(categoriesData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
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
        `http://localhost:4567/produtos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number(id),
            nome: name,
            preco: Number(preco),
            estoque: Number(estoque),
            categoria: {id: Number(categoria)}
          }),
        }
      );

      if (!response.ok) throw new Error();

      navigate("/produtos");
    } catch (error) {
      console.error("Erro ao editar produto:", error);
    }
  };

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="page-container">
      <h1 className="title">Editar Produto</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Preço:</label>
        <input
          className="input"
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />

        <label>Estoque:</label>
        <input
          className="input"
          type="number"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
          required
        />

        <label>Categoria:</label>
        <select
          className="input"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>

          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome || cat.nome_categoria}
            </option>
          ))}
        </select>

        <button className="btn edit" type="submit">
          Salvar
        </button>

        <button
          type="button"
          className="btn delete"
          onClick={() => navigate("/produtos")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
