import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-container home-wrapper">

      <div className="home-box">
        <h1 className="title home-title">Gerenciador de produtos e categorias</h1>

        <p className="home-subtitle">
          por: <a href="https://github.com/Gamas02">Gamas02</a>
        </p>

        {/* PRODUTOS */}
        <div className="home-options">
          <Link to="/produtos/add" className="btn create home-btn">Cadastrar produtos</Link>
          <Link to="/produtos" className="btn edit home-btn">Listar produtos</Link>
        </div>
        {/* CATEGORIAS */}
        <div className="home-options">
          <Link to="/categorias/add" className="btn create home-btn">Cadastrar categoria</Link>
          <Link to="/categorias" className="btn edit home-btn">Listar categorias</Link>
        </div>
      </div>

    </div>
  );
}
