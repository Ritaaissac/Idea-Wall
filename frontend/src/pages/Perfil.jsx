import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/perfil.css";

import urso from "../assets/img/urso3.png";
import fundo from "../assets/img/fundo.png";

import iconeNome from "../assets/img/icons/icon1.png";
import iconeEmail from "../assets/img/icons/icon5.png";
import iconeSenha from "../assets/img/icons/icon2.png";
import iconeDados from "../assets/img/icons/icon3.png";
import iconeQuadros from "../assets/img/folha.png";
import iconeTarefas from "../assets/img/lampada.png";
import iconeAlterarSenha from "../assets/img/icons/icon6.png";

// =====================================
// AVATARES DE PERFIL
// =====================================
// Os arquivos estão em:
// src/assets/img/icons_perfil/
// 1.png, 2.png, 3.png ... 25.png

const arquivosIcones = import.meta.glob(
  "../assets/img/icons_perfil/*.png",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// Cria a lista com os 25 avatares
const iconesPerfil = Array.from(
  { length: 25 },
  (_, index) =>
    arquivosIcones[
      `../assets/img/icons_perfil/${index + 1}.png`
    ]
);

// Avatar padrão = 1.png
const avatarPadrao =
  arquivosIcones["../assets/img/icons_perfil/1.png"];


export default function Perfil() {
  const navigate = useNavigate();

  // =====================================
  // USUÁRIO
  // =====================================

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    foto: avatarPadrao,
  });

  const [mostrarIcones, setMostrarIcones] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Alteração de senha
  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);


  // =====================================
  // CARREGAR USUÁRIO
  // =====================================

  useEffect(() => {
    const dadosUsuario = localStorage.getItem("usuario");

    if (dadosUsuario) {
      const usuarioSalvo = JSON.parse(dadosUsuario);

      // Se o usuário ainda não possui foto,
      // utiliza automaticamente o avatar 1.png
      if (!usuarioSalvo.foto) {
        usuarioSalvo.foto = avatarPadrao;

        localStorage.setItem(
          "usuario",
          JSON.stringify(usuarioSalvo)
        );
      }

      setUsuario(usuarioSalvo);

    } else {
      navigate("/cadastro");
    }

  }, [navigate]);


  // =====================================
  // SELECIONAR FOTO DE PERFIL
  // =====================================

  function selecionarIcone(icone) {

    const usuarioAtualizado = {
      ...usuario,
      foto: icone,
    };

    setUsuario(usuarioAtualizado);

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioAtualizado)
    );

    setMostrarIcones(false);
  }


  // =====================================
  // ALTERAR SENHA
  // =====================================

  async function handleAlterarSenha(e) {
    e.preventDefault();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senhaAtual === novaSenha) {
      alert("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setAlterandoSenha(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/alterar-senha",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: usuario.email,
            senha_atual: senhaAtual,
            nova_senha: novaSenha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Não foi possível alterar a senha.");
        return;
      }

      alert("Senha alterada com sucesso!");

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setMostrarSenhaAtual(false);
      setMostrarNovaSenha(false);
      setMostrarConfirmarSenha(false);
      setMostrarAlterarSenha(false);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setAlterandoSenha(false);
    }
  }

  function fecharAlterarSenha() {
    if (alterandoSenha) return;

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setMostrarSenhaAtual(false);
    setMostrarNovaSenha(false);
    setMostrarConfirmarSenha(false);
    setMostrarAlterarSenha(false);
  }


  // =====================================
  // LOGOUT
  // =====================================

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

        <img
          src="src/assets/img/logo.png"
          alt="Logo"
          className="logo"
        />


        {/* MINI FOTO DO USUÁRIO */}

        <div className="avatar-sidebar">

          <div className="avatar">

            <img
              src={usuario.foto || avatarPadrao}
              alt="Foto do usuário"
            />

          </div>

        </div>


        {/* MENU */}

        <nav className="menu">

          <button
            onClick={() => navigate("/quadros")}
            className="quadro-button"
          >
            Quadros
          </button>


          <button
            onClick={() => navigate("/criar-quadro")}
            className="criar-quadro-button"
          >
            Criar quadro
          </button>

        </nav>


        {/* LOGOUT */}

        <button
          className="logout"
          onClick={handleLogout}
        >
          <span className="icone-logout">
            ↪
          </span>

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
                  onClick={() =>
                    setMostrarIcones(true)
                  }
                  title="Alterar foto de perfil"
                >

                  <img
                    src={
                      usuario.foto ||
                      avatarPadrao
                    }
                    alt="Foto de perfil"
                  />

                </button>


                {/* BOTÃO EDITAR */}

                <button
                  className="editar-foto"
                  onClick={() =>
                    setMostrarIcones(true)
                  }
                  title="Alterar foto"
                >
                  ✎
                </button>


                {/* =====================================
                    SELEÇÃO DOS AVATARES
                ====================================== */}

                {mostrarIcones && (

                  <div className="seletor-icones">

                    <div className="seletor-icones-card">


                      {/* FECHAR */}

                      <button
                        className="fechar-icones"
                        onClick={() =>
                          setMostrarIcones(false)
                        }
                      >
                        ×
                      </button>


                      <h2>
                        Escolha seu avatar
                      </h2>


                      <p>
                        Escolha uma foto para seu perfil
                      </p>


                      {/* 25 AVATARES */}

                      <div className="lista-icones">

                        {iconesPerfil.map(
                          (icone, index) => {

                            // Evita erro caso algum
                            // arquivo não exista
                            if (!icone) {
                              return null;
                            }

                            return (

                              <button
                                key={index}
                                className={`icone-opcao ${
                                  usuario.foto === icone
                                    ? "selecionado"
                                    : ""
                                }`}
                                onClick={() =>
                                  selecionarIcone(icone)
                                }
                              >

                                <img
                                  src={icone}
                                  alt={`Avatar ${
                                    index + 1
                                  }`}
                                />

                              </button>

                            );
                          }
                        )}

                      </div>

                    </div>

                  </div>

                )}

              </div>


              {/* =====================================
                  NOME
              ====================================== */}

              <div className="campo">

                <label>
                  Nome
                </label>

                <div className="input-perfil">

                  <img
                    src={iconeNome}
                    alt=""
                    className="icone-campo-nome"
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

                <label>
                  Email
                </label>

                <div className="input-perfil">

                  <img
                    src={iconeEmail}
                    alt=""
                    className="icone-campo-email"
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

                <label>
                  Senha
                </label>

                <div className="input-perfil senha-perfil">

                  <img
                    src={iconeSenha}
                    alt=""
                    className="icone-campo-senha"
                  />

                  <p className="senha-mascarada">
                    Senha protegida
                  </p>


                </div>

                <button
                  type="button"
                  className="botao-alterar-senha"
                  onClick={() => setMostrarAlterarSenha(true)}
                > <text>Alterar senha</text>
                </button>

              </div>


            </section>


            {/* =====================================
                LADO DIREITO
            ====================================== */}

            <section className="lado-direito">


              {/* BALÃO */}

              <div className="fala">
              <img src="src/assets/img/fala_urso.png" alt="" className="fala-urso"/>
                <p>

                  Olá, eu sou o Bear! Bem-vindo
                  <br />

                  à sua plataforma de organização pessoal
                  <br />

                   e profissional. Crie, organize
                  <br />

                   e conclua suas tarefas com mais
                  <br />

                   planejamento no IDEA WALL.
                  <br />
                </p>

              </div>


              {/* =====================================
                  CARD DADOS
              ====================================== */}

              <div className="card-dados">


                <div className="titulo-dados">

                  <img
                    src={iconeDados}
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

          {/* =====================================
              MODAL - ALTERAR SENHA
          ====================================== */}

          {mostrarAlterarSenha && (
            <div
              className="modal-senha-overlay"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  fecharAlterarSenha();
                }
              }}
            >
              <div className="modal-senha">

                <button
                  type="button"
                  className="fechar-modal-senha"
                  onClick={fecharAlterarSenha}
                  disabled={alterandoSenha}
                  title="Fechar"
                >
                  ×
                </button>

                <div className="icone-modal-senha">
                  <img src="src/assets/img/icons/icon2.png" alt="" className="icone-modal" />
                </div>

                <h2>Alterar senha</h2>

                <p className="descricao-modal-senha">
                  Digite sua senha atual e escolha uma nova senha.
                </p>

                <form onSubmit={handleAlterarSenha}>

                  <div className="campo-senha-modal">
                    <label>Senha atual</label>

                    <div className="input-senha-modal">
                      <input
                        type={mostrarSenhaAtual ? "text" : "password"}
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        placeholder="Digite sua senha atual"
                        autoComplete="current-password"
                        disabled={alterandoSenha}
                        required
                      />

                      <button
                        type="button"
                        className="olho-modal"
                        onClick={() =>
                          setMostrarSenhaAtual(!mostrarSenhaAtual)
                        }
                        title={
                          mostrarSenhaAtual
                            ? "Ocultar senha"
                            : "Mostrar senha"
                        }
                      >
                        {mostrarSenhaAtual ? "◉" : "◌"}
                      </button>
                    </div>
                  </div>

                  <div className="campo-senha-modal">
                    <label>Nova senha</label>

                    <div className="input-senha-modal">
                      <input
                        type={mostrarNovaSenha ? "text" : "password"}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="Digite a nova senha"
                        autoComplete="new-password"
                        disabled={alterandoSenha}
                        required
                      />

                      <button
                        type="button"
                        className="olho-modal"
                        onClick={() =>
                          setMostrarNovaSenha(!mostrarNovaSenha)
                        }
                        title={
                          mostrarNovaSenha
                            ? "Ocultar senha"
                            : "Mostrar senha"
                        }
                      >
                        {mostrarNovaSenha ? "◉" : "◌"}
                      </button>
                    </div>
                  </div>

                  <div className="campo-senha-modal">
                    <label>Confirmar nova senha</label>

                    <div className="input-senha-modal">
                      <input
                        type={
                          mostrarConfirmarSenha ? "text" : "password"
                        }
                        value={confirmarSenha}
                        onChange={(e) =>
                          setConfirmarSenha(e.target.value)
                        }
                        placeholder="Digite novamente a nova senha"
                        autoComplete="new-password"
                        disabled={alterandoSenha}
                        required
                      />

                      <button
                        type="button"
                        className="olho-modal"
                        onClick={() =>
                          setMostrarConfirmarSenha(
                            !mostrarConfirmarSenha
                          )
                        }
                        title={
                          mostrarConfirmarSenha
                            ? "Ocultar senha"
                            : "Mostrar senha"
                        }
                      >
                        {mostrarConfirmarSenha ? "◉" : "◌"}
                      </button>
                    </div>
                  </div>

                  <div className="acoes-modal-senha">
                    <button
                      type="button"
                      className="cancelar-senha"
                      onClick={fecharAlterarSenha}
                      disabled={alterandoSenha}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="salvar-senha"
                      disabled={alterandoSenha}
                    >
                      {alterandoSenha
                        ? "Alterando..."
                        : "Salvar nova senha"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
