import { useState } from "react";

export default function Add() {
  const [nome, setNome] = useState("");

  const addCategorias = async (e) => {
  e.preventDefault();

  if (!nome.trim()) return;

  try {
    const res = await fetch("http://localhost:4567/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("RESPOSTA DO BACKEND:", txt);
      alert("Erro ao cadastrar categoria. Veja o console.");
      return;
    }

    setNome("");

    alert("Categoria cadastrada!");
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
  }
};


  return (
    <div className="page-container">
      <h1 className="title">Cadastrar Produto</h1>

      <form onSubmit={addCategorias} className="form-card">

        <div>
          <label>Nome</label>
          <input
            className="input"
            type="text"
            placeholder="Digite nome da categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <button className="btn create" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
