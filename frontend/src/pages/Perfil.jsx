import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/perfil.css";

import urso from "../assets/img/urso.png";
import fundo from "../assets/img/fundo.png";

import iconeNome from "../assets/img/icons/icon1.png";
import iconeEmail from "../assets/img/icons/icon5.png";
import iconeSenha from "../assets/img/icons/icon2.png";
import iconeQuadros from "../assets/img/folha.png";
import iconeTarefas from "../assets/img/lampada.png";


export default function Perfil() {
  const navigate = useNavigate();

  const inputFotoRef = useRef(null);

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    foto: "",
  });

  useEffect(() => {
    const dadosUsuario = localStorage.getItem("usuario");

    if (dadosUsuario) {
      setUsuario(JSON.parse(dadosUsuario));
    } else {
      navigate("/cadastro");
    }
  }, [navigate]);


  // ==============================
  // ALTERAR FOTO DE PERFIL
  // ==============================

  function abrirSeletorFoto() {
    inputFotoRef.current.click();
  }


  function alterarFoto(e) {
    const arquivo = e.target.files[0];

    if (!arquivo) {
      return;
    }

    // Verifica se é uma imagem
    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      return;
    }

    // Converte a imagem para Base64
    const leitor = new FileReader();

    leitor.onload = () => {
      const novaFoto = leitor.result;

      const usuarioAtualizado = {
        ...usuario,
        foto: novaFoto,
      };

      setUsuario(usuarioAtualizado);

      // Salva a nova foto no navegador
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioAtualizado)
      );
    };

    leitor.readAsDataURL(arquivo);
  }


  // ==============================
  // LOGOUT
  // ==============================

  function handleLogout() {
    localStorage.removeItem("usuario");
    navigate("/login");
  }


  return (
    <div
      className="pagina-perfil"
      style={{
        backgroundImage: `url(${fundo})`,
      }}
    >

      {/* =====================================
          MENU LATERAL
      ====================================== */}

      <aside className="sidebar">

        <div className="logo">
          <span>Idea</span>
          <span>Wall</span>
        </div>


        {/* MINI FOTO DO USUÁRIO */}

        <div className="avatar-sidebar">
          <div className="avatar">

            {usuario.foto ? (
              <img
                src={usuario.foto}
                alt="Foto do usuário"
              />
            ) : (
              <span>
                {usuario.nome
                  ? usuario.nome.charAt(0).toUpperCase()
                  : "U"}
              </span>
            )}

          </div>
        </div>


        {/* MENU */}

        <nav className="menu">

          <button onClick={() => navigate("/quadros")}>
            <span className="icone-menu">▤</span>
            Quadros
          </button>


          <button onClick={() => navigate("/criar-quadro")}>
            <span className="icone-menu">＋</span>
            Criar quadro
          </button>

        </nav>


        {/* LOGOUT */}

        <button
          className="logout"
          onClick={handleLogout}
        >
          <span className="icone-logout">↪</span>
          Logout
        </button>

      </aside>


      {/* =====================================
          CONTEÚDO
      ====================================== */}

      <main className="conteudo-perfil">

        <div className="perfil-container">


          {/* TÍTULO */}

          <div className="titulo-perfil">

            <span className="brilhos">
              ✦
            </span>

            <h1>
              Meu <span>Perfil</span>
            </h1>

          </div>


          <div className="perfil-grid">


            {/* =====================================
                DADOS DO USUÁRIO
            ====================================== */}

            <section className="dados-usuario">


              {/* FOTO */}

              <div className="foto-container">

                <button
                  className="foto-perfil"
                  onClick={abrirSeletorFoto}
                  title="Alterar foto de perfil"
                >

                  {usuario.foto ? (
                    <img
                      src={usuario.foto}
                      alt="Foto de perfil"
                    />
                  ) : (
                    <span>
                      {usuario.nome
                        ? usuario.nome
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </span>
                  )}

                </button>


                {/* BOTÃO EDITAR */}

                <button
                  className="editar-foto"
                  onClick={abrirSeletorFoto}
                  title="Alterar foto"
                >
                  ✎
                </button>


                {/* INPUT DE ARQUIVO ESCONDIDO */}

                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/*"
                  onChange={alterarFoto}
                  className="input-foto"
                />

              </div>


              {/* =====================================
                  NOME
              ====================================== */}

              <div className="campo">

                <label>Nome</label>

                <div className="input-perfil">

                  <img
                    src={iconeNome}
                    alt=""
                    className="icone-campo"
                  />

                  <p>
                    {usuario.nome ||
                      "Nome não informado"}
                  </p>

                </div>

              </div>


              {/* =====================================
                  EMAIL
              ====================================== */}

              <div className="campo">

                <label>Email</label>

                <div className="input-perfil">

                  <img
                    src={iconeEmail}
                    alt=""
                    className="icone-campo"
                  />

                  <p>
                    {usuario.email ||
                      "Email não informado"}
                  </p>

                </div>

              </div>


              {/* =====================================
                  SENHA
              ====================================== */}

              <div className="campo">

                <label>Senha</label>

                <div className="input-perfil">

                  <img
                    src={iconeSenha}
                    alt=""
                    className="icone-campo"
                  />

                  <p>
                    {usuario.senha
                      ? "•".repeat(
                          Math.min(
                            usuario.senha.length,
                            10
                          )
                        )
                      : "••••••••"}
                  </p>

                  <span className="olho">
                    ◉
                  </span>

                </div>

              </div>

            </section>


            {/* =====================================
                LADO DIREITO
            ====================================== */}

            <section className="lado-direito">


              {/* BALÃO */}

              <div className="fala-urso">

                <p>
                  Olá, eu sou o Bear!
                  <br />
                  Bem-vindo à sua plataforma
                  <br />
                  de organização pessoal e
                  <br />
                  profissional. Crie,
                  <br />
                  organize e conclua suas
                  <br />
                  tarefas com mais
                  <br />
                  planejamento no IDEA
                  WALL.
                </p>

              </div>


              {/* =====================================
                  CARD DADOS
              ====================================== */}

              <div className="card-dados">

                <div className="titulo-dados">

                  <img
                    src={iconeQuadros}
                    alt=""
                    className="icone-dados-titulo"
                  />

                  <h2>
                    Dados
                  </h2>

                </div>


                {/* QUADROS */}

                <div className="estatistica">

                  <img
                    src={iconeQuadros}
                    alt=""
                    className="icone-estatistica"
                  />

                  <div>

                    <strong>
                      12
                    </strong>

                    <p>
                      Quadros criados
                    </p>

                  </div>

                </div>


                {/* TAREFAS */}

                <div className="estatistica">

                  <img
                    src={iconeTarefas}
                    alt=""
                    className="icone-estatistica"
                  />

                  <div>

                    <strong>
                      8
                    </strong>

                    <p>
                      Tarefas salvas
                    </p>

                  </div>

                </div>

              </div>


              {/* URSO */}

              <img
                src={urso}
                alt="Urso do Idea Wall"
                className="urso-perfil"
              />

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}