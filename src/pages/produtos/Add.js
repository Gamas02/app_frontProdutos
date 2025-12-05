import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:4567/categorias");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategorias(data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  const addProduto = async (e) => {
    e.preventDefault();

    if (!nome || !preco || !estoque || !categoria) return;

    try {
      const res = await fetch("http://localhost:4567/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          preco: Number(preco),
          estoque: Number(estoque),
          categoria: { id: Number(categoria) },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("RESPOSTA DO BACKEND:", txt);
        return;
      }

      navigate("/produtos");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="title">Cadastrar Produto</h1>

      <form onSubmit={addProduto} className="form-card">
        <div>
          <label>Nome</label>
          <input
            className="input"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Preço</label>
          <input
            className="input"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Estoque</label>
          <input
            className="input"
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            required
          />
        </div>

        <div>
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
        </div>

        <button className="btn create" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
