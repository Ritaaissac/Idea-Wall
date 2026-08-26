import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "../styles/tarefas.css";

import fundo from "../assets/img/fundo.png";
import lampada from "../assets/img/lampada.png";
import calendario from "../assets/img/calendario.png";
import MenuLateral from "../components/MenuLateral";

const COLUNAS = [
  { id: "a-fazer", titulo: "A Fazer", classe: "fazer" },
  { id: "andamento", titulo: "Em andamento", classe: "andamento" },
  { id: "concluido", titulo: "Concluído", classe: "concluido" },
];

export default function Tarefas() {
  const navigate = useNavigate();
  const { quadroId } = useParams();
  const location = useLocation();

  const [quadro, setQuadro] = useState(location.state?.quadro || null);
  const [tarefas, setTarefas] = useState([]);
  const [tarefaArrastada, setTarefaArrastada] = useState(null);
  const [menuAberto, setMenuAberto] = useState(null);
  const [ordenacaoAberta, setOrdenacaoAberta] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState("manual");

  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [dataTarefa, setDataTarefa] = useState("");

  const token = localStorage.getItem("token")?.replace(/^"+|"+$/g, "").trim();

  // Carrega os dados do quadro se necessário
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!quadro && quadroId) {
      fetch(`http://127.0.0.1:8000/quadros/${quadroId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((dados) => setQuadro(dados))
        .catch(() => navigate("/quadros"));
    }
  }, [quadro, quadroId, token, navigate]);

  // Carrega as tarefas do banco via API
  useEffect(() => {
    if (!token || !quadroId) return;

    fetch(`http://127.0.0.1:8000/quadros/${quadroId}/tarefas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((dados) => setTarefas(dados))
      .catch((err) => console.error("Erro ao carregar tarefas:", err));
  }, [quadroId, token]);

  /* =====================================================
     DRAG AND DROP COM PERSISTÊNCIA NA API
     ===================================================== */

  function iniciarArraste(event, tarefa) {
    setTarefaArrastada(tarefa);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(tarefa.id));
  }

  function permitirSoltar(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  async function soltarTarefa(event, novoStatus) {
    event.preventDefault();
    if (!tarefaArrastada || tarefaArrastada.status === novoStatus) return;

    const tarefaOriginal = tarefaArrastada;

    // Atualização otimista na interface
    setTarefas((prev) =>
      prev.map((t) => (t.id === tarefaOriginal.id ? { ...t, status: novoStatus } : t))
    );

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/quadros/${quadroId}/tarefas/${tarefaOriginal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar status");
    } catch (err) {
      console.error(err);
      // Reverte se a API falhar
      setTarefas((prev) =>
        prev.map((t) => (t.id === tarefaOriginal.id ? tarefaOriginal : t))
      );
    } finally {
      setTarefaArrastada(null);
    }
  }

  function finalizarArraste() {
    setTarefaArrastada(null);
  }

  function ordenarTarefas(tarefasDaColuna) {
    if (ordenarPor === "manual") return tarefasDaColuna;

    return [...tarefasDaColuna].sort((tarefaA, tarefaB) => {
      if (ordenarPor === "alfabetica") {
        return tarefaA.titulo.localeCompare(tarefaB.titulo, "pt-BR", { sensitivity: "base" });
      }
      const [diaA, mesA] = (tarefaA.data || "").split("/").map(Number);
      const [diaB, mesB] = (tarefaB.data || "").split("/").map(Number);
      const dataA = mesA && diaA ? mesA * 100 + diaA : Infinity;
      const dataB = mesB && diaB ? mesB * 100 + diaB : Infinity;
      return dataA - dataB;
    });
  }

  function selecionarOrdenacao(opcao) {
    setOrdenarPor(opcao);
    setOrdenacaoAberta(false);
  }

  /* =====================================================
     CRIAR / EDITAR TAREFA
     ===================================================== */

  function abrirModalCriar(status = "a-fazer") {
    setModoEdicao(false);
    setTarefaEditando({ status });
    setTituloTarefa("");
    setDataTarefa("");
    setMenuAberto(null);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setModoEdicao(true);
    setTarefaEditando(tarefa);
    setTituloTarefa(tarefa.titulo);
    setDataTarefa(tarefa.data || "");
    setMenuAberto(null);
    setModalAberto(true);
  }

  async function salvarTarefa(event) {
    event.preventDefault();
    if (!tituloTarefa.trim()) return;

    if (modoEdicao && tarefaEditando) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/quadros/${quadroId}/tarefas/${tarefaEditando.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              titulo: tituloTarefa.trim(),
              data: dataTarefa.trim(),
            }),
          }
        );

        if (res.ok) {
          const atualizada = await res.json();
          setTarefas((prev) =>
            prev.map((t) => (t.id === atualizada.id ? atualizada : t))
          );
        }
      } catch (err) {
        console.error("Erro ao editar tarefa:", err);
      }
    } else {
      try {
        const res = await fetch(`http://127.0.0.1:8000/quadros/${quadroId}/tarefas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: tituloTarefa.trim(),
            data: dataTarefa.trim(),
            status: tarefaEditando?.status || "a-fazer",
          }),
        });

        if (res.ok) {
          const nova = await res.json();
          setTarefas((prev) => [...prev, nova]);
        }
      } catch (err) {
        console.error("Erro ao criar tarefa:", err);
      }
    }

    fecharModal();
  }

  async function excluirTarefa(id) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/quadros/${quadroId}/tarefas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTarefas((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
    setMenuAberto(null);
  }

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
      style={{ backgroundImage: `url(${fundo})` }}
      onClick={() => setMenuAberto(null)}
    >
      <MenuLateral />

      <main className="tarefas-content">
        <header className="tarefas-header">
          <div className="titulo-quadro">
            <input
              type="text"
              readOnly
              value={quadro?.titulo || "Carregando..."}
              aria-label="Nome do quadro"
            />
            <span className="linha-titulo"></span>
          </div>

          <div className="ordenar-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="botao-ordenar"
              onClick={() => setOrdenacaoAberta(!ordenacaoAberta)}
              aria-expanded={ordenacaoAberta}
              aria-haspopup="menu"
            >
              Ordenar <span>⌄</span>
            </button>

            {ordenacaoAberta && (
              <div className="menu-ordenar" role="menu">
                <button type="button" onClick={() => selecionarOrdenacao("data")}>
                  Por data
                </button>
                <button type="button" onClick={() => selecionarOrdenacao("alfabetica")}>
                  Ordem alfabética
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="kanban">
          {COLUNAS.map((coluna) => {
            const tarefasDaColuna = ordenarTarefas(
              tarefas.filter((tarefa) => tarefa.status === coluna.id)
            );

            return (
              <div
                key={coluna.id}
                className={`kanban-coluna ${coluna.classe}`}
                onDragOver={permitirSoltar}
                onDrop={(event) => soltarTarefa(event, coluna.id)}
              >
                <div className="coluna-header">
                  <div className="coluna-titulo">
                    <span className="status-dot"></span>
                    <span>{coluna.titulo}</span>
                  </div>
                </div>

                <div className="lista-tarefas">
                  {tarefasDaColuna.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className={`tarefa-card ${
                        tarefaArrastada?.id === tarefa.id ? "arrastando" : ""
                      }`}
                      draggable
                      onDragStart={(event) => iniciarArraste(event, tarefa)}
                      onDragEnd={finalizarArraste}
                    >
                      <div className="tarefa-topo">
                        <div className="tarefa-info">
                          <span className="tarefa-radio"></span>
                          <span className="tarefa-titulo">{tarefa.titulo}</span>
                        </div>

                        <div
                          className="tarefa-menu-container"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="tarefa-menu-btn"
                            onClick={() =>
                              setMenuAberto(menuAberto === tarefa.id ? null : tarefa.id)
                            }
                            aria-label="Opções da tarefa"
                          >
                            •••
                          </button>

                          {menuAberto === tarefa.id && (
                            <div className="tarefa-menu">
                              <button type="button" onClick={() => abrirModalEditar(tarefa)}>
                                ✎ Editar
                              </button>
                              <button
                                type="button"
                                className="excluir"
                                onClick={() => excluirTarefa(tarefa.id)}
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
                  ))}
                </div>

                <button
                  type="button"
                  className="adicionar-tarefa"
                  onClick={() => abrirModalCriar(coluna.id)}
                >
                  Adicionar tarefa +
                </button>
              </div>
            );
          })}
        </section>

        <p className="dica-kanban">
          <img src={lampada} alt="" />
          Dica: arraste as tarefas entre as colunas para atualizar o status.
        </p>
      </main>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-tarefa" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modoEdicao ? "Editar tarefa" : "Nova tarefa"}</h2>
              <button type="button" className="modal-fechar" onClick={fecharModal}>
                ×
              </button>
            </div>

            <form onSubmit={salvarTarefa}>
              <label>
                Nome da tarefa
                <input
                  type="text"
                  value={tituloTarefa}
                  onChange={(e) => setTituloTarefa(e.target.value)}
                  placeholder="Digite o nome da tarefa"
                  autoFocus
                />
              </label>

              <label>
                Data
                <input
                  type="text"
                  value={dataTarefa}
                  onChange={(e) => setDataTarefa(e.target.value)}
                  placeholder="Ex.: 23/07"
                />
              </label>

              <div className="modal-acoes">
                <button type="button" className="botao-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="botao-salvar">
                  {modoEdicao ? "Salvar alterações" : "Adicionar tarefa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}