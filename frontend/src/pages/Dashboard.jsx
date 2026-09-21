import React, { useEffect, useMemo, useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  FiCheck,
  FiCircle,
  FiGrid,
  FiPlus
} from "react-icons/fi";

import "../styles/dashboard.css";

import MenuLateral from "../components/MenuLateral";

import urso from "../assets/img/urso 6.png";


const SEMANA = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa"
];


function normalizarStatus(status) {

  if (!status) {
    return "a-fazer";
  }

  return String(status)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
}


function criarCalendario(data) {
  const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1).getDay();
  const diasNoMes = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
  const inicioDomingo = primeiroDia;
  const dias = [
    ...Array.from({ length: inicioDomingo }, () => null),
    ...Array.from({ length: diasNoMes }, (_, index) => index + 1),
  ];

  while (dias.length % 7 !== 0) dias.push(null);

  return Array.from({ length: dias.length / 7 }, (_, index) =>
    dias.slice(index * 7, index * 7 + 7)
  );
}


function obterAlturaBarra(
  valor,
  maiorValor
) {

  if (
    !maiorValor ||
    maiorValor <= 0
  ) {
    return "18%";
  }

  if (!valor || valor <= 0) {
    return "18%";
  }

  const percentual =
    (valor / maiorValor) * 82;

  return `${Math.max(
    18,
    Math.round(percentual)
  )}%`;
}


export default function Dashboard() {

  const navigate = useNavigate();
  const [dataAtual] = useState(() => new Date());
  const [dashboardData, setDashboardData] = useState({
    tarefas_do_dia: [],
    estatisticas: {
      a_fazer: 0,
      em_andamento: 0,
      concluidas: 0,
      total: 0,
      quadros: 0,
    },
    dias_com_tarefas: [],
    mes: {
      nome: dataAtual.toLocaleDateString("pt-BR", { month: "long" }),
      ano: dataAtual.getFullYear(),
    },
    data_formatada: dataAtual.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const calendario = useMemo(() => criarCalendario(dataAtual), [dataAtual.getFullYear(), dataAtual.getMonth()]);
  const usuarioSalvo = localStorage.getItem("usuario");
  let usuario = null;

  try {
    usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  } catch {
    usuario = null;
  }

  useEffect(() => {
    let ativo = true;

    const token = localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!token) {
      setErro("Você precisa fazer login para ver o dashboard.");
      setCarregando(false);
      return () => {
        ativo = false;
      };
    }

    fetch("http://127.0.0.1:8000/dashboard", {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Sessão expirada ou inválida.");
        }

        const dados = await response.json();

        if (!ativo) {
          return;
        }

        setDashboardData({
          tarefas_do_dia: dados.tarefas_do_dia || [],
          estatisticas: dados.estatisticas || {
            a_fazer: 0,
            em_andamento: 0,
            concluidas: 0,
            total: 0,
            quadros: 0,
          },
          dias_com_tarefas: dados.dias_com_tarefas || [],
          mes: dados.mes || {
            nome: dataAtual.toLocaleDateString("pt-BR", { month: "long" }),
            ano: dataAtual.getFullYear(),
          },
          data_formatada: dados.data_formatada || dataAtual.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
        setErro("");
      })
      .catch((error) => {
        if (!ativo) {
          return;
        }

        setErro(error.message || "Não foi possível carregar o dashboard.");
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const tarefasDoDia = dashboardData.tarefas_do_dia;
  const estatisticas = dashboardData.estatisticas;
  const diasComTarefas = dashboardData.dias_com_tarefas;
  const mesNome = dashboardData.mes?.nome || dataAtual.toLocaleDateString("pt-BR", { month: "long" });
  const ano = dashboardData.mes?.ano || dataAtual.getFullYear();
  const dataFormatada = dashboardData.data_formatada || dataAtual.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });


  // ==========================================================
  // NOME
  // ==========================================================

  const nome =
    usuario?.nome
      ?.split(" ")[0] ||
    "criativo";


  // ==========================================================
  // GRÁFICO
  // ==========================================================

  const barras = useMemo(() => {

    const dados = [

      {
        valor: Number(
          estatisticas.a_fazer || 0
        ),

        label: "A fazer"
      },

      {
        valor: Number(
          estatisticas.em_andamento || 0
        ),

        label: "Em andamento"
      },

      {
        valor: Number(
          estatisticas.concluidas || 0
        ),

        label: "Concluídas"
      }

    ];


    const maiorValor =
      Math.max(
        ...dados.map(
          item => item.valor
        ),
        1
      );


    return dados.map(
      (item) => ({

        ...item,

        altura:
          obterAlturaBarra(
            item.valor,
            maiorValor
          )
      })
    );

  }, [
    estatisticas.a_fazer,
    estatisticas.em_andamento,
    estatisticas.concluidas
  ]);


  // ==========================================================
  // VERIFICAR DIA COM TAREFA
  // ==========================================================

  function marcarDiaComTarefa(
    dia
  ) {

    return diasComTarefas.includes(
      dia
    );
  }


  // ==========================================================
  // VERIFICAR SE É HOJE
  // ==========================================================

  function ehHoje(dia) {

    if (!dia) {
      return false;
    }


    return dia === dataAtual.getDate();
  }


  // ==========================================================
  // ABRIR TAREFA
  // ==========================================================

  function abrirTarefa(
    tarefa
  ) {

    if (
      tarefa?.quadro_id
    ) {

      navigate(
        `/tarefas/${tarefa.quadro_id}`
      );

    }

  }


  // ==========================================================
  // ABRIR QUADROS
  // ==========================================================

  function abrirQuadros() {

    navigate(
      "/quadros"
    );

  }


  // ==========================================================
  // ABRIR CRIAR QUADRO
  // ==========================================================

  function criarQuadro() {

    navigate(
      "/criar-quadro"
    );

  }


  // ==========================================================
  // TELA
  // ==========================================================

  return (

    <div className="dashboard-page">

      <MenuLateral />


      <main className="dashboard-content">


        {/* ==================================================
            CABEÇALHO
        ================================================== */}

        <header
          className="dashboard-welcome"
        >

          <div>

            <span>
              {dataFormatada}
            </span>


            <h1>
              Olá, {nome}!
            </h1>


            <p>
              Organize suas tarefas.
            </p>

          </div>


          <img
            src={urso}
            alt="Urso do Idea Wall"
          />


        </header>


        {/* ==================================================
            WIDGETS
        ================================================== */}

        <section
          className="dashboard-widgets"
          aria-label="Resumo do dashboard"
        >


          {/* =================================================
              CALENDÁRIO
          ================================================= */}

          <article
            className="dashboard-widget dashboard-calendar"
          >

            <div
              className="dashboard-widget-title"
            >

              <h2>

                {mesNome}

                <small>
                  {ano}
                </small>

              </h2>


            </div>


            <div
              className="calendar-weekdays"
            >

              {SEMANA.map(
                (dia) => (

                  <span
                    key={dia}
                  >
                    {dia}
                  </span>

                )
              )}

            </div>


            <div
              className="calendar-days"
            >

              {calendario.flatMap(
                (
                  semana,
                  semanaIndex
                ) =>

                  semana.map(
                    (
                      dia,
                      diaIndex
                    ) => {

                      const hoje =
                        ehHoje(
                          dia
                        );


                      const temTarefa =
                        dia &&
                        marcarDiaComTarefa(
                          dia
                        );


                      return (

                        <span
                          key={`${semanaIndex}-${diaIndex}`}
                          className={`
                            ${hoje ? "calendar-today" : ""}
                            ${temTarefa ? "calendar-has-task" : ""}
                          `}
                        >

                          {dia || ""}

                        </span>

                      );

                    }
                  )

              )}

            </div>

          </article>


          {/* =================================================
              GRÁFICO
          ================================================= */}

          <article
            className="dashboard-widget dashboard-chart"
          >

            <div
              className="dashboard-chart-bars"
              aria-label="Estatísticas das tarefas"
            >

              {barras.map(
                (barra) => (

                  <div
                    key={barra.label}
                    className="chart-bar-container"
                  >

                    <span
                      className="chart-bar"
                      style={{
                        height:
                          barra.altura
                      }}
                      title={`${barra.label}: ${barra.valor}`}
                    >

                      <i>
                        {barra.valor}
                      </i>

                    </span>

                  </div>

                )
              )}

            </div>


            <div
              className="dashboard-chart-labels"
            >

              {barras.map(
                (barra) => (

                  <span
                    key={barra.label}
                  >
                    {barra.label}
                  </span>

                )
              )}

            </div>

          </article>


          {/* =================================================
              TAREFAS DO DIA
          ================================================= */}

          <article
            className="dashboard-widget dashboard-tasks"
          >

            <div
              className="dashboard-widget-title"
            >

              <h2>
                Tarefas do dia
              </h2>


              <FiCheck
                aria-hidden="true"
              />

            </div>


            {carregando ? (

              <p className="dashboard-empty">
                Carregando tarefas...
              </p>

            ) : erro ? (

              <p className="dashboard-empty">
                {erro}
              </p>

            ) : tarefasDoDia.length === 0 ? (

              <p
                className="dashboard-empty"
              >
                Nenhuma tarefa para hoje.
              </p>

            ) : (

              <ul>

                {tarefasDoDia
                  .slice(0, 4)
                  .map(
                    (tarefa) => {

                      const status =
                        normalizarStatus(
                          tarefa.status
                        );


                      const concluida =
                        status ===
                          "concluido" ||
                        status ===
                          "concluida";


                      return (

                        <li
                          key={
                            tarefa.id
                          }
                          className={
                            concluida
                              ? "task-done"
                              : ""
                          }
                          title="Abrir quadro da tarefa"
                        >

                          <button
                            type="button"
                            onClick={() =>
                              abrirTarefa(
                                tarefa
                              )
                            }
                            aria-label={`Abrir tarefa ${tarefa.titulo}`}
                          >

                            {concluida ? (
                              <FiCheck />
                            ) : (
                              <FiCircle />
                            )}

                          </button>


                          <button
                            type="button"
                            className="dashboard-task-title"
                            onClick={() =>
                              abrirTarefa(
                                tarefa
                              )
                            }
                          >

                            <span>
                              {tarefa.titulo}
                            </span>

                          </button>

                        </li>

                      );

                    }
                  )}

              </ul>

            )}

          </article>


        </section>


        {/* ==================================================
            RODAPÉ
        ================================================== */}

        <footer
          className="dashboard-footer"
        >

          <span>
            Tur<em>b</em>ine e organize suas tarefas com a gente!
          </span>


          <div
            className="dashboard-footer-buttons"
          >

            <button
              type="button"
              onClick={abrirQuadros}
              aria-label="Abrir quadros"
              title="Meus quadros"
            >

              <FiGrid />

            </button>


            <button
              type="button"
              onClick={criarQuadro}
              aria-label="Criar novo quadro"
              title="Criar quadro"
            >

              <FiPlus />

            </button>

          </div>

        </footer>


      </main>

    </div>

  );
}