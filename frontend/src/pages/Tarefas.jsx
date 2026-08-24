import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/tarefas.css";

import fundo from "../assets/img/fundo.png";
import lampada from "../assets/img/lampada.png";
import calendario from "../assets/img/calendario.png";
import MenuLateral from "../components/MenuLateral";

const COLUNAS = [
  {
    id: "a-fazer",
    titulo: "A Fazer",
    classe: "fazer",
  },
  {
    id: "andamento",
    titulo: "Em andamento",
    classe: "andamento",
  },
  {
    id: "concluido",
    titulo: "Concluído",
    classe: "concluido",
  },
];

const tarefasIniciais = [
  {
    id: 1,
    titulo: "Lista de PIU",
    data: "23/07",
    status: "a-fazer",
  },
  {
    id: 2,
    titulo: "Consertar cores do site",
    data: "23/07",
    status: "a-fazer",
  },
  {
    id: 3,
    titulo: "Fazer atividade de sociologia",
    data: "23/07",
    status: "a-fazer",
  },
];

export default function Tarefas() {
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState(() => {
    try {
      const salvas = localStorage.getItem("tarefas");

      return salvas
        ? JSON.parse(salvas)
        : tarefasIniciais;
    } catch {
      return tarefasIniciais;
    }
  });

  const [tarefaArrastada, setTarefaArrastada] = useState(null);

  const [menuAberto, setMenuAberto] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);

  const [tarefaEditando, setTarefaEditando] = useState(null);

  const [tituloTarefa, setTituloTarefa] = useState("");

  const [dataTarefa, setDataTarefa] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "tarefas",
      JSON.stringify(tarefas)
    );
  }, [tarefas]);

  function handleLogout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  }

  function buscarUsuario() {
    try {
      return JSON.parse(
        localStorage.getItem("usuario") || "null"
      );
    } catch {
      return null;
    }
  }

  const usuario = buscarUsuario();

  function abrirPerfilComTeclado(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate("/perfil");
    }
  }

  /* =====================================================
     DRAG AND DROP
     ===================================================== */

  function iniciarArraste(event, tarefa) {
    setTarefaArrastada(tarefa);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      String(tarefa.id)
    );
  }

  function permitirSoltar(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function soltarTarefa(event, novoStatus) {
    event.preventDefault();

    if (!tarefaArrastada) return;

    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === tarefaArrastada.id
          ? {
              ...tarefa,
              status: novoStatus,
            }
          : tarefa
      )
    );

    setTarefaArrastada(null);
  }

  function finalizarArraste() {
    setTarefaArrastada(null);
  }

  /* =====================================================
     CRIAR TAREFA
     ===================================================== */

  function abrirModalCriar(status = "a-fazer") {
    setModoEdicao(false);

    setTarefaEditando({
      status,
    });

    setTituloTarefa("");
    setDataTarefa("");

    setMenuAberto(null);
    setModalAberto(true);
  }

  /* =====================================================
     EDITAR TAREFA
     ===================================================== */

  function abrirModalEditar(tarefa) {
    setModoEdicao(true);

    setTarefaEditando(tarefa);

    setTituloTarefa(tarefa.titulo);
    setDataTarefa(tarefa.data || "");

    setMenuAberto(null);
    setModalAberto(true);
  }

  /* =====================================================
     SALVAR TAREFA
     ===================================================== */

  function salvarTarefa(event) {
    event.preventDefault();

    if (!tituloTarefa.trim()) {
      return;
    }

    if (modoEdicao && tarefaEditando) {
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefa) =>
          tarefa.id === tarefaEditando.id
            ? {
                ...tarefa,
                titulo: tituloTarefa.trim(),
                data: dataTarefa,
              }
            : tarefa
        )
      );
    } else {
      const novaTarefa = {
        id: Date.now(),
        titulo: tituloTarefa.trim(),
        data: dataTarefa,
        status: tarefaEditando?.status || "a-fazer",
      };

      setTarefas((tarefasAtuais) => [
        ...tarefasAtuais,
        novaTarefa,
      ]);
    }

    fecharModal();
  }

  /* =====================================================
     EXCLUIR TAREFA
     ===================================================== */

  function excluirTarefa(id) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.filter(
        (tarefa) => tarefa.id !== id
      )
    );

    setMenuAberto(null);
  }

  /* =====================================================
     MODAL
     ===================================================== */

  function fecharModal() {
    setModalAberto(false);
    setModoEdicao(false);
    setTarefaEditando(null);
    setTituloTarefa("");
    setDataTarefa("");
  }

  return (
    <div
      className="tarefas-page"
      style={{
        backgroundImage: `url(${fundo})`,
      }}
      onClick={() => setMenuAberto(null)}
    >
      {/* =================================================
          SIDEBAR
          ================================================= */}

      <MenuLateral />

      {/* =================================================
          CONTEÚDO PRINCIPAL
          ================================================= */}

      <main className="tarefas-content">
        <header className="tarefas-header">
          <div className="titulo-quadro">
            <input
              type="text"
              defaultValue="Nome do quadro"
              aria-label="Nome do quadro"
            />

            <span className="linha-titulo"></span>
          </div>

          <button
            type="button"
            className="botao-ordenar"
          >
            Ordenar
            <span>⌄</span>
          </button>
        </header>

        {/* =================================================
            KANBAN
            ================================================= */}

        <section className="kanban">
          {COLUNAS.map((coluna) => {
            const tarefasDaColuna = tarefas.filter(
              (tarefa) =>
                tarefa.status === coluna.id
            );

            return (
              <div
                key={coluna.id}
                className={`kanban-coluna ${coluna.classe}`}
                onDragOver={permitirSoltar}
                onDrop={(event) =>
                  soltarTarefa(
                    event,
                    coluna.id
                  )
                }
              >
                {/* Cabeçalho da coluna */}

                <div className="coluna-header">
                  <div className="coluna-titulo">
                    <span className="status-dot"></span>
                    <span>{coluna.titulo}</span>
                  </div>
                </div>

                {/* Tarefas */}

                <div className="lista-tarefas">
                  {tarefasDaColuna.map(
                    (tarefa) => (
                      <div
                        key={tarefa.id}
                        className={`tarefa-card ${
                          tarefaArrastada?.id ===
                          tarefa.id
                            ? "arrastando"
                            : ""
                        }`}
                        draggable
                        onDragStart={(event) =>
                          iniciarArraste(
                            event,
                            tarefa
                          )
                        }
                        onDragEnd={
                          finalizarArraste
                        }
                      >
                        <div className="tarefa-topo">
                          <div className="tarefa-info">
                            <span className="tarefa-radio"></span>

                            <span className="tarefa-titulo">
                              {tarefa.titulo}
                            </span>
                          </div>

                          {/* MENU DOS 3 PONTOS */}

                          <div
                            className="tarefa-menu-container"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            <button
                              type="button"
                              className="tarefa-menu-btn"
                              onClick={() =>
                                setMenuAberto(
                                  menuAberto ===
                                    tarefa.id
                                    ? null
                                    : tarefa.id
                                )
                              }
                              aria-label="Opções da tarefa"
                            >
                              •••
                            </button>

                            {menuAberto ===
                              tarefa.id && (
                              <div className="tarefa-menu">
                                <button
                                  type="button"
                                  onClick={() =>
                                    abrirModalEditar(
                                      tarefa
                                    )
                                  }
                                >
                                  ✎ Editar
                                </button>

                                <button
                                  type="button"
                                  className="excluir"
                                  onClick={() =>
                                    excluirTarefa(
                                      tarefa.id
                                    )
                                  }
                                >
                                  🗑 Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {tarefa.data && (
                          <div className="tarefa-data">
                            <img src={calendario} alt="" />
                            {tarefa.data}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* Adicionar tarefa */}

                <button
                  type="button"
                  className="adicionar-tarefa"
                  onClick={() =>
                    abrirModalCriar(
                      coluna.id
                    )
                  }
                >
                  Adicionar tarefa +
                </button>
              </div>
            );
          })}
        </section>

        <p className="dica-kanban">
          <img src={lampada} alt="" />
          Dica: arraste as tarefas entre as colunas
          para atualizar o status.
        </p>
      </main>

      {/* =================================================
          MODAL CRIAR / EDITAR
          ================================================= */}

      {modalAberto && (
        <div
          className="modal-overlay"
          onClick={fecharModal}
        >
          <div
            className="modal-tarefa"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>
                {modoEdicao
                  ? "Editar tarefa"
                  : "Nova tarefa"}
              </h2>

              <button
                type="button"
                className="modal-fechar"
                onClick={fecharModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={salvarTarefa}>
              <label>
                Nome da tarefa
                <input
                  type="text"
                  value={tituloTarefa}
                  onChange={(event) =>
                    setTituloTarefa(
                      event.target.value
                    )
                  }
                  placeholder="Digite o nome da tarefa"
                  autoFocus
                />
              </label>

              <label>
                Data
                <input
                  type="text"
                  value={dataTarefa}
                  onChange={(event) =>
                    setDataTarefa(
                      event.target.value
                    )
                  }
                  placeholder="Ex.: 23/07"
                />
              </label>

              <div className="modal-acoes">
                <button
                  type="button"
                  className="botao-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="botao-salvar"
                >
                  {modoEdicao
                    ? "Salvar alterações"
                    : "Adicionar tarefa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
