import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


import Home from "./pages/Home";

// Produtos
import ProdutosList from "./pages/produtos/List";
import ProdutosAdd from "./pages/produtos/Add";
import ProdutosEdit from "./pages/produtos/Edit";

// Categorias
import CategoriasList from "./pages/categorias/List";
import CategoriasAdd from "./pages/categorias/Add";
import CategoriasEdit from "./pages/categorias/Edit";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="main-wrapper">
        <Routes>

          <Route path="/" element={<Home />} />

          {/* PRODUTOS */}    
          <Route path="/produtos" element={<ProdutosList />} />
          <Route path="/produtos/add" element={<ProdutosAdd />} />
          <Route path="/produtos/edit/:id" element={<ProdutosEdit />} />

          {/* CATEGORIAS */}
          <Route path="/categorias" element={<CategoriasList />} />
          <Route path="/categorias/add" element={<CategoriasAdd />} />
          <Route path="/categorias/edit/:id" element={<CategoriasEdit />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}
