import { useNavigate } from "react-router-dom";

import "../styles/index.css";

import logo from "../assets/img/logo.png";
import perfil from "../assets/img/perfil.png";
import urso2 from "../assets/img/urso2.png";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />

          <div className="perfil">
            <img
              src={perfil}
              alt="Perfil"
            />
          </div>

          <button
            className="menu-btn"
            onClick={() => navigate("/quadros")}
          >
            Quadros
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/criar-quadro")}
          >
            Criar quadro
          </button>
        </div>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          ⮕ Logout
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">

        {/* HEADER */}
        <section className="banner">
          <div className="banner-text">
            <span>Julho 24, 2026</span>

            <h2>Olá, Rita!</h2>

            <p>
              Organize as suas tarefas.
            </p>
          </div>

          <img
            src={urso2}
            alt="Banner"
            className="urso2"
          />
        </section>

        {/* CARDS */}
        <section className="cards">

          {/* CALENDÁRIO */}
          <div className="card calendario">
            <h3>Maio</h3>

            <div className="dias">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>

              {Array.from(
                { length: 31 },
                (_, i) => (
                  <span key={i}>
                    {i + 1}
                  </span>
                )
              )}
            </div>
          </div>

          {/* GRÁFICO */}
          <div className="card grafico">
            <div className="bars">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
            </div>
          </div>

          {/* TAREFAS */}
          <div className="card tarefas">
            <h3>Tarefas do dia</h3>

            <div className="task"></div>
            <div className="task"></div>
            <div className="task"></div>
            <div className="task"></div>
          </div>

        </section>

        {/* FOOTER */}
        <section className="footer-card">
          Turbine e organize suas tarefas com a gente!
        </section>

      </main>

    </div>
  );
}