import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/criarquadro.css";

import urso from "../assets/img/urso4.png";
import fundo from "../assets/img/fundo.png";
import MenuLateral from "../components/MenuLateral";


const ICONS = [
  {
    id: "escola",
    label: "Escola / Faculdade",
    file: "../assets/img/quadros/escola.png",
    svg: "graduation",
  },
  {
    id: "trabalho",
    label: "Trabalho",
    file: "../assets/img/quadros/trabalho.png",
    svg: "briefcase",
  },
  {
    id: "pessoal",
    label: "Pessoal",
    file: "../assets/img/quadros/pessoal.png",
    svg: "person",
  },
  {
    id: "viagens",
    label: "Viagens",
    file: "../assets/img/quadros/viagens.png",
    svg: "plane",
  },
];

function IconSvg({ type }) {
  const common = {
    width: 42,
    height: 42,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "graduation") {
    return (
      <svg {...common}>
        <path d="M5 18 24 9l19 9-19 9L5 18Z" />
        <path d="M12 23v9c5 4 19 4 24 0v-9" />
        <path d="M43 19v11" />
        <path d="M43 34c-2 0-3-2-3-4s1-4 3-4 3 2 3 4-1 4-3 4Z" />
      </svg>
    );
  }

  if (type === "briefcase") {
    return (
      <svg {...common}>
        <rect x="6" y="13" width="36" height="27" rx="4" />
        <path d="M17 13V9h14v4" />
        <path d="M6 23h36" />
        <path d="M21 23v4h6v-4" />
      </svg>
    );
  }

  if (type === "person") {
    return (
      <svg {...common}>
        <circle cx="24" cy="15" r="7" />
        <path d="M10 40c1-9 6-14 14-14s13 5 14 14" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 27 44 10 30 43 24 29 4 27Z" />
      <path d="m24 29 9 8" />
    </svg>
  );
}

function IconOption({ item, selected, onSelect }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      className={`icon-option ${selected ? "selected" : ""}`}
      onClick={() => onSelect(item)}
      title={item.label}
      aria-label={`Selecionar ${item.label}`}
    >
      <span className="icon-option-art">
        {!failed ? (
          <img
            src={item.file}
            alt=""
            onError={() => setFailed(true)}
          />
        ) : (
          <IconSvg type={item.svg} />
        )}
      </span>

      <span>{item.label}</span>
    </button>
  );
}

export default function CriarQuadro() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const iconTitle = useMemo(
    () => selectedIcon?.label || "Escolher ícone",
    [selectedIcon]
  );

  function handleLogout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleCreate(event) {
    event.preventDefault();

    if (!titulo.trim()) {
      document.querySelector("#titulo-quadro")?.focus();
      return;
    }

    // 1. Busca o token no localStorage
    let token = localStorage.getItem("token");

    if (!token) {
      alert("Nenhum token de autenticação encontrado. Faça login novamente.");
      return;
    }

    // Limpa aspas duplas ou espaços que possam ter vindo do localStorage
    token = token.replace(/^"+|"+$/g, '').trim();

    setSaving(true);

    try {
      // 2. Faz a chamada POST para o backend em FastAPI
      const response = await fetch("http://127.0.0.1:8000/quadros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          icone: selectedIcon.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sucesso ao salvar no MySQL:", data);
        alert("Quadro criado com sucesso!");
        navigate(`/tarefas/${data.id}`, {
          state: { quadro: data },
        });
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar quadro: ${errorData.detail || "Falha na requisição"}`);
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      alert("Erro ao conectar com o servidor backend.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="criar-quadro-page"
      style={{ backgroundImage: `url(${fundo})` }}
    >

      <MenuLateral />
      {/* CONTEÚDO */}
      <main className="cq-main">

        <section
          className="cq-card"
          aria-labelledby="titulo-pagina"
        >

          {/* TÍTULO */}
          <div className="cq-heading">

            <h1 id="titulo-pagina">
              Crie o seu
              <span>quadro</span>
            </h1>

          </div>

          {/* FORMULÁRIO */}
          <form
            className="cq-form"
            onSubmit={handleCreate}
          >

            <label
              htmlFor="titulo-quadro"
              className="sr-only"
            >
              Título do quadro
            </label>

            <input
              id="titulo-quadro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do quadro"
              maxLength={80}
              required
            />

            <label
              htmlFor="descricao-quadro"
              className="sr-only"
            >
              Descrição do quadro
            </label>

            <input
              id="descricao-quadro"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição"
              maxLength={160}
            />

            <button
              type="submit"
              className="cq-create"
              disabled={saving}
            >
              {saving ? "Criando..." : "Criar →"}
            </button>

          </form>

          {/* SELETOR DE ÍCONE */}
          <div className="cq-icon-area">

            <button
              type="button"
              className="cq-icon-preview"
              onClick={() =>
                setPickerOpen((open) => !open)
              }
              aria-expanded={pickerOpen}
              aria-haspopup="dialog"
              title={`Escolher ícone: ${iconTitle}`}
            >

              <span className="cq-preview-art">
                <IconSvg type={selectedIcon.svg} />
              </span>

              <span className="cq-edit-icon">
                ✎
              </span>

            </button>

            <span className="cq-icon-hint">
              Escolha um ícone
            </span>

            {pickerOpen && (
              <div
                className="cq-picker"
                role="dialog"
                aria-label="Escolher ícone do quadro"
              >

                <div className="cq-picker-title">
                  Escolha o tema
                </div>

                <div className="cq-options">

                  {ICONS.map((item) => (
                    <IconOption
                      key={item.id}
                      item={item}
                      selected={
                        selectedIcon.id === item.id
                      }
                      onSelect={(icon) => {
                        setSelectedIcon(icon);
                        setPickerOpen(false);
                      }}
                    />
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* MASCOTE */}
          <img
            src={urso}
            alt="Mascote do Idea Wall"
            className="cq-bear"
          />

        </section>

      </main>
    </div>
  );
}
