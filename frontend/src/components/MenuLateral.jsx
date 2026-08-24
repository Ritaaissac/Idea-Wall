import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiPlus,
  FiLogOut,
} from "react-icons/fi";

import "../styles/menuLateral.css";

import logo from "../assets/img/logo.png";
import usuarioPadrao from "../assets/img/usuario.png";

export default function MenuLateral() {

  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(null);


  /* =====================================================
     CARREGAR USUÁRIO
  ===================================================== */

useEffect(() => {
  function carregarUsuario() {
    const dados = localStorage.getItem("usuario");

    if (dados) {
      try {
        setUsuario(JSON.parse(dados));
      } catch {
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  }

  // Carrega ao abrir o menu
  carregarUsuario();

  // Atualiza imediatamente quando o perfil mudar
  window.addEventListener(
    "usuarioAtualizado",
    carregarUsuario
  );

  // Também funciona se o localStorage mudar em outra aba
  window.addEventListener(
    "storage",
    carregarUsuario
  );

  return () => {
    window.removeEventListener(
      "usuarioAtualizado",
      carregarUsuario
    );

    window.removeEventListener(
      "storage",
      carregarUsuario
    );
  };
}, []);


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");

  }


  /* =====================================================
     MENU LATERAL
  ===================================================== */

  return (

    <aside className="menu-lateral-global">


      {/* =================================================
          LOGO
      ================================================= */}

      <div className="menu-lateral-global-logo">

        <img
          src={logo}
          alt="Logo Idea Wall"
        />

      </div>


      {/* =================================================
          AVATAR / PERFIL
      ================================================= */}

      <div className="menu-lateral-global-perfil">

        <button
          type="button"
          className="menu-lateral-global-avatar"
          onClick={() => navigate("/perfil")}
          title="Meu perfil"
        >

          <img
            src={usuario?.foto || usuarioPadrao}
            alt="Meu perfil"
          />

        </button>

      </div>


      {/* =================================================
          MENU
      ================================================= */}

      <nav className="menu-lateral-global-nav">


        {/* =================================================
            QUADROS
        ================================================= */}

        <button
          type="button"
          className={`menu-lateral-global-item ${
            location.pathname === "/quadros"
              ? "menu-lateral-global-ativo"
              : ""
          }`}
          onClick={() => navigate("/quadros")}
        >

          <FiGrid />

          <span>
            Quadros
          </span>

        </button>


        {/* =================================================
            CRIAR QUADRO
        ================================================= */}

        <button
          type="button"
          className={`menu-lateral-global-item ${
            location.pathname === "/criar-quadro"
              ? "menu-lateral-global-ativo"
              : ""
          }`}
          onClick={() => navigate("/criar-quadro")}
        >

          <FiPlus />

          <span>
            Criar quadro
          </span>

        </button>


      </nav>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <div className="menu-lateral-global-footer">

        <button
          type="button"
          className="menu-lateral-global-logout"
          onClick={logout}
        >

          <FiLogOut />

          <span>
            Logout
          </span>

        </button>

      </div>


    </aside>

  );

}