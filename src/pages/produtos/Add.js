import { useState } from "react";

export default function Add() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoria, setCategoria] = useState("");

  const addProduto = async (e) => {
  e.preventDefault();

  if (!nome.trim() || !preco.trim() || !estoque.trim() || !categoria.trim()) return;

  try {
    const res = await fetch("http://localhost:4567/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria: { id: parseInt(categoria) }
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("RESPOSTA DO BACKEND:", txt);
      alert("Erro ao cadastrar produto. Veja o console.");
      return;
    }

    setNome("");
    setPreco("");
    setEstoque("");
    setCategoria("");

    alert("Produto cadastrado!");
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
            placeholder="Digite nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label>Preço</label>
          <input
            className="input"
            type="text"
            placeholder="Digite preço do produto"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>

        <div>
          <label>Estoque</label>
          <input
            className="input"
            type="number"
            placeholder="Quant. Estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
        </div>

        <div>
          <label>Categoria</label>
          <input
            className="input"
            type="text"
            placeholder="Digite a categoria produto"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <button className="btn create" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
