import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../styles/cadastro.css";
import urso from "../assets/img/urso.png";
import fundo from "../assets/img/fundo.png";

export default function Cadastro() {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.senha.length < 6) {
      setMensagem({ texto: "A senha deve ter pelo menos 6 caracteres.", tipo: "erro" });
      return;
    }

    try {
      // TODO: Levar a URL base abaixo (até a barra) para um arquivo .env, por exemplo, que não suba para o GitHub
      const response = await fetch("http://127.0.0.1:8000/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ texto: "Cadastro realizado com sucesso!", tipo: "sucesso" });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMensagem({ texto: data.detail || "Erro ao realizar cadastro.", tipo: "erro" });
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMensagem({ texto: "Não foi possível conectar ao servidor.", tipo: "erro" });
    }
  }

  return (
    <div className="pagina" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="container">
        <div className="left">
          <h1>
            Faça o seu
            <span className="texto2"> cadastro</span>
          </h1>

          <div className="urso">
            <img src={urso} alt="" />
          </div>
        </div>

        <div className="right">
          <form className="form-box" onSubmit={handleSubmit}>
            {mensagem.texto && (
              <div role="alert" style={{ color: mensagem.tipo === "sucesso" ? "#2e7d32" : "#c62828", background: mensagem.tipo === "sucesso" ? "#e8f5e9" : "#ffebee", padding: "16px 14px", borderRadius: "10px", textAlign: "center", fontSize: "14px", marginTop: "30px"}}>
                {mensagem.texto}
              </div>
            )}
            <div className="input-group">
              <input
                type="text"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nome: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Senha"
                minLength={6}
                value={form.senha}
                onChange={(e) =>
                  setForm({
                    ...form,
                    senha: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="cadastro">
              <Link to="/login">Já tem uma conta? Faça login</Link>
            </div>

            <button type="submit" className="btn-cadastro">
              Cadastrar →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}