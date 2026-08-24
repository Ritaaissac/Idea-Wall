import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiPlus,
  FiLogOut,
  FiGrid,
  FiUser,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
} from "react-icons/fi";

import "../styles/quadros.css";
import MenuLateral from "../components/MenuLateral";

import logo from "../assets/img/logo.png";
import usuarioPadrao from "../assets/img/usuario.png";
import fundo from "../assets/img/fundo.png";
import urso from "../assets/img/urso5.png";


/* =====================================================
   ÍCONES DOS QUADROS
===================================================== */

function IconeQuadro({ tipo }) {
  if (tipo === "escola") {
    return (
      <svg
        viewBox="0 0 48 48"
        className="icone-svg"
      >
        <path d="M5 18 24 9l19 9-19 9L5 18Z" />
        <path d="M12 23v9c5 4 19 4 24 0v-9" />
        <path d="M43 19v11" />
      </svg>
    );
  }

  if (tipo === "trabalho") {
    return (
      <svg
        viewBox="0 0 48 48"
        className="icone-svg"
      >
        <rect
          x="6"
          y="13"
          width="36"
          height="27"
          rx="4"
        />
        <path d="M17 13V9h14v4" />
        <path d="M6 23h36" />
        <path d="M21 23v4h6v-4" />
      </svg>
    );
  }

  if (tipo === "pessoal") {
    return <FiUser />;
  }

  if (tipo === "viagens") {
    return (
      <svg
        viewBox="0 0 48 48"
        className="icone-svg"
      >
        <path d="M4 27 44 10 30 43 24 29 4 27Z" />
        <path d="m24 29 9 8" />
      </svg>
    );
  }

  return <FiGrid />;
}


/* =====================================================
   COMPONENTE
===================================================== */

export default function Quadros() {

  const navigate = useNavigate();

  const [quadros, setQuadros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [usuario, setUsuario] = useState(null);

  const [menuAberto, setMenuAberto] = useState(null);

const [quadroEditando, setQuadroEditando] = useState(null);

const [dadosEdicao, setDadosEdicao] = useState({
  titulo: "",
  descricao: "",
  icone: "pessoal",
});

const [salvandoEdicao, setSalvandoEdicao] = useState(false);


  /* =====================================================
     USUÁRIO
  ===================================================== */

  useEffect(() => {

    const dados = localStorage.getItem("usuario");

    if (dados) {
      try {
        setUsuario(JSON.parse(dados));
      } catch {
        setUsuario(null);
      }
    }

  }, []);


  /* =====================================================
     BUSCAR QUADROS
  ===================================================== */

  useEffect(() => {

    async function carregarQuadros() {

      const tokenSalvo = localStorage.getItem("token");

      if (!tokenSalvo) {
        navigate("/login");
        return;
      }

      const token = tokenSalvo
        .replace(/^"+|"+$/g, "")
        .trim();

      try {

        setCarregando(true);
        setErro("");

        const response = await fetch(
          "http://127.0.0.1:8000/quadros",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (response.status === 401) {

          localStorage.removeItem("token");
          localStorage.removeItem("usuario");

          navigate("/login");

          return;
        }


        if (!response.ok) {

          let mensagem =
            "Não foi possível carregar os quadros.";

          try {
            const dados = await response.json();

            if (dados.detail) {
              mensagem = dados.detail;
            }

          } catch {
            // mantém mensagem padrão
          }

          throw new Error(mensagem);
        }


        const dados = await response.json();

        setQuadros(
          Array.isArray(dados)
            ? dados
            : dados.quadros || []
        );

      } catch (error) {

        console.error(
          "Erro ao carregar quadros:",
          error
        );

        setErro(
          error.message ||
          "Erro ao carregar os quadros."
        );

      } finally {

        setCarregando(false);

      }
    }


    carregarQuadros();

  }, [navigate]);


  /* =====================================================
     PESQUISA
  ===================================================== */

  const quadrosFiltrados = useMemo(() => {

    const texto = pesquisa
      .trim()
      .toLowerCase();

    if (!texto) {
      return quadros;
    }

    return quadros.filter((quadro) => {

      const titulo =
        quadro.titulo?.toLowerCase() || "";

      const descricao =
        quadro.descricao?.toLowerCase() || "";

      return (
        titulo.includes(texto) ||
        descricao.includes(texto)
      );

    });

  }, [quadros, pesquisa]);


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");

  }


  /* =====================================================
     ÍCONE DO QUADRO
  ===================================================== */

  function obterIcone(quadro) {

    return (
      <IconeQuadro
        tipo={quadro.icone}
      />
    );

  }

  /* =====================================================
   MENU DOS QUADROS
===================================================== */

function abrirMenu(e, quadroId) {
  e.stopPropagation();

  setMenuAberto(
    menuAberto === quadroId ? null : quadroId
  );
}


/* =====================================================
   EDITAR QUADRO
===================================================== */

function abrirEdicao(e, quadro) {
  e.stopPropagation();

  setMenuAberto(null);

  setQuadroEditando(quadro);

  setDadosEdicao({
    titulo: quadro.titulo || "",
    descricao: quadro.descricao || "",
    icone: quadro.icone || "pessoal",
  });
}


function fecharEdicao() {
  if (salvandoEdicao) return;

  setQuadroEditando(null);

  setDadosEdicao({
    titulo: "",
    descricao: "",
    icone: "pessoal",
  });
}


/* =====================================================
   SALVAR EDIÇÃO
===================================================== */

async function salvarEdicao(e) {
  e.preventDefault();

  if (!dadosEdicao.titulo.trim()) {
    alert("Digite um título para o quadro.");
    return;
  }

  const tokenSalvo = localStorage.getItem("token");

  if (!tokenSalvo) {
    navigate("/login");
    return;
  }

  const token = tokenSalvo
    .replace(/^"+|"+$/g, "")
    .trim();

  try {
    setSalvandoEdicao(true);

    const response = await fetch(
      `http://127.0.0.1:8000/quadros/${quadroEditando.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: dadosEdicao.titulo.trim(),
          descricao: dadosEdicao.descricao.trim(),
          icone: dadosEdicao.icone,
        }),
      }
    );

    const dados = await response.json();

    if (!response.ok) {
      throw new Error(
        dados.detail || "Não foi possível editar o quadro."
      );
    }

    setQuadros((quadrosAtuais) =>
      quadrosAtuais.map((quadro) =>
        quadro.id === quadroEditando.id
          ? {
              ...quadro,
              ...dados,
              titulo: dados.titulo ?? dadosEdicao.titulo.trim(),
              descricao:
                dados.descricao ??
                dadosEdicao.descricao.trim(),
              icone: dados.icone ?? dadosEdicao.icone,
            }
          : quadro
      )
    );

    fecharEdicao();

  } catch (error) {
    console.error("Erro ao editar quadro:", error);

    alert(
      error.message ||
      "Não foi possível editar o quadro."
    );

  } finally {
    setSalvandoEdicao(false);
  }
}


/* =====================================================
   EXCLUIR QUADRO
===================================================== */

async function excluirQuadro(e, quadro) {
  e.stopPropagation();

  setMenuAberto(null);

  const confirmou = window.confirm(
    `Tem certeza que deseja excluir o quadro "${quadro.titulo}"?\n\nEssa ação não poderá ser desfeita.`
  );

  if (!confirmou) {
    return;
  }

  const tokenSalvo = localStorage.getItem("token");

  if (!tokenSalvo) {
    navigate("/login");
    return;
  }

  const token = tokenSalvo
    .replace(/^"+|"+$/g, "")
    .trim();

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/quadros/${quadro.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let mensagem = "Não foi possível excluir o quadro.";

      try {
        const dados = await response.json();

        if (dados.detail) {
          mensagem = dados.detail;
        }
      } catch {
        // mantém mensagem padrão
      }

      throw new Error(mensagem);
    }

    setQuadros((quadrosAtuais) =>
      quadrosAtuais.filter(
        (item) => item.id !== quadro.id
      )
    );

  } catch (error) {
    console.error("Erro ao excluir quadro:", error);

    alert(
      error.message ||
      "Não foi possível excluir o quadro."
    );
  }
}


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <main
      className="quadros-page"
      style={{
        "--fundo": `url(${fundo})`,
      }}
    >

      {/* =================================================
          MENU LATERAL
      ================================================= */}

      <MenuLateral />


     

      <section className="quadros-content">


        {/* PESQUISA */}

        <div className="quadros-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) =>
              setPesquisa(e.target.value)
            }
          />

        </div>


        {/* =================================================
            QUADROS
        ================================================= */}

        <div className="quadros-area">


          {carregando && (

            <div className="quadros-loading">
              Carregando seus quadros...
            </div>

          )}


          {!carregando && erro && (

            <div className="quadros-error">

              <p>
                {erro}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Tentar novamente
              </button>

            </div>

          )}


          {!carregando &&
            !erro &&
            quadrosFiltrados.length === 0 && (

              <div className="quadros-vazio">

                <FiGrid />

                <h2>
                  {pesquisa
                    ? "Nenhum quadro encontrado"
                    : "Você ainda não possui quadros"}
                </h2>

                <p>
                  Crie seu primeiro quadro
                  para começar a organizar
                  suas atividades.
                </p>

              </div>

            )}


          {!carregando &&
            !erro &&
            quadrosFiltrados.map((quadro) => (

              <div
                key={quadro.id}
                className="quadro-card"
                onClick={() => {
                  console.log("Quadro selecionado:", quadro);
                }}
              >

                <div className="quadro-icon">
                  {obterIcone(quadro)}
                </div>

                <div className="quadro-info">
                  <h2>{quadro.titulo}</h2>

                  <p>
                    {quadro.descricao ||
                      "Descrição do quadro..."}
                  </p>
                </div>

                <button
                  type="button"
                  className="dots-button"
                  onClick={(e) =>
                    abrirMenu(e, quadro.id)
                  }
                  title="Opções do quadro"
                >
                  <FiMoreVertical />
                </button>

                {menuAberto === quadro.id && (
                  <div
                    className="quadro-menu"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <button
                      type="button"
                      className="quadro-menu-item editar"
                      onClick={(e) =>
                        abrirEdicao(e, quadro)
                      }
                    >
                      <FiEdit2 />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      className="quadro-menu-item excluir"
                      onClick={(e) =>
                        excluirQuadro(e, quadro)
                      }
                    >
                      <FiTrash2 />
                      <span>Excluir quadro</span>
                    </button>
                  </div>
                )}

              </div>

            ))}


          {/* =================================================
              NOVO QUADRO
          ================================================= */}

          {!carregando &&
            !erro && (

              <button
                type="button"
                className="novo-quadro-card"
                onClick={() =>
                  navigate("/criar-quadro")
                }
              >

                <span>
                  <FiPlus />
                </span>

              </button>

            )}

        </div>

      </section>


      {/* =================================================
          PAINEL DIREITO
      ================================================= */}

      <aside className="quadros-right">


        {/* CONCLUÍDAS */}

        <div className="progresso-item">

          <div className="progresso-header">

            <span>
              Concluídas
            </span>

            <strong>
              70%
            </strong>

          </div>

          <div className="barra">

            <span
              style={{
                width: "70%",
              }}
            />

          </div>

        </div>


        {/* EM ANDAMENTO */}

        <div className="progresso-item">

          <div className="progresso-header">

            <span>
              Em andamento
            </span>

            <strong>
              50%
            </strong>

          </div>

          <div className="barra">

            <span
              style={{
                width: "50%",
              }}
            />

          </div>

        </div>


        {/* PENDENTES */}

        <div className="progresso-item">

          <div className="progresso-header">

            <span>
              Pendentes
            </span>

            <strong>
              20%
            </strong>

          </div>

          <div className="barra">

            <span
              style={{
                width: "20%",
              }}
            />

          </div>

        </div>


        {/* URSO */}

        <div className="urso-box">

          <img
            src={urso}
            alt="Mascote do Idea Wall"
          />

        </div>

      </aside>


      {/* =====================================================
          MODAL EDITAR QUADRO
      ===================================================== */}

      {quadroEditando && (
        <div
          className="modal-quadro-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              fecharEdicao();
            }
          }}
        >
          <div className="modal-quadro">

            <button
              type="button"
              className="modal-quadro-fechar"
              onClick={fecharEdicao}
              disabled={salvandoEdicao}
            >
              <FiX />
            </button>

            <div className="modal-quadro-header">
              <FiEdit2 />

              <div>
                <h2>Editar quadro</h2>
                <p>
                  Altere as informações do seu quadro.
                </p>
              </div>
            </div>

            <form onSubmit={salvarEdicao}>

              <div className="campo-quadro-modal">
                <label>Nome do quadro</label>

                <input
                  type="text"
                  value={dadosEdicao.titulo}
                  onChange={(e) =>
                    setDadosEdicao({
                      ...dadosEdicao,
                      titulo: e.target.value,
                    })
                  }
                  placeholder="Digite o nome do quadro"
                  maxLength={100}
                  disabled={salvandoEdicao}
                />
              </div>

              <div className="campo-quadro-modal">
                <label>Descrição</label>

                <textarea
                  value={dadosEdicao.descricao}
                  onChange={(e) =>
                    setDadosEdicao({
                      ...dadosEdicao,
                      descricao: e.target.value,
                    })
                  }
                  placeholder="Digite uma descrição para o quadro"
                  rows="4"
                  maxLength={500}
                  disabled={salvandoEdicao}
                />
              </div>

              <div className="campo-quadro-modal">
                <label>Ícone</label>

                <select
                  value={dadosEdicao.icone}
                  onChange={(e) =>
                    setDadosEdicao({
                      ...dadosEdicao,
                      icone: e.target.value,
                    })
                  }
                  disabled={salvandoEdicao}
                >
                  <option value="pessoal">Pessoal</option>
                  <option value="escola">Escola</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="viagens">Viagens</option>
                </select>
              </div>

              <div className="modal-quadro-acoes">

                <button
                  type="button"
                  className="modal-quadro-cancelar"
                  onClick={fecharEdicao}
                  disabled={salvandoEdicao}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="modal-quadro-salvar"
                  disabled={salvandoEdicao}
                >
                  <FiSave />

                  {salvandoEdicao
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </main>

  );
}
