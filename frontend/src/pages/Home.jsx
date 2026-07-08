import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

import simbolo from "../assets/img/simbolo.png";
import lampada from "../assets/img/lampada.png";
import folha from "../assets/img/folha.png";
import foguete from "../assets/img/foguete.png";
import mesa from "../assets/img/mesa.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="area">
        <img src={simbolo} alt="" className="simbolo" />

        <h1>
          Bem vindo(a)
          <span> ao Idea Wall</span>
        </h1>

        <p>
          O lugar perfeito para dar vida às suas ideias,
          organizar seus projetos e transformar planos em realidade.
        </p>

        <div className="cards">
          <div className="card">
            <img src={lampada} alt="" />
            <span>Inspire-se</span>
          </div>

          <div className="card">
            <img src={folha} alt="" />
            <span>Organize</span>
          </div>

          <div className="card">
            <img src={foguete} alt="" />
            <span>Realize</span>
          </div>
        </div>

        <button onClick={() => navigate("/Cadastro")}>
          <b>Começar agora →</b>
        </button>
      </div>

      <div className="mesa">
        <img src={mesa} alt="" />
      </div>
    </section>
  );
}