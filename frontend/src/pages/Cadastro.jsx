import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importado o Link para navegação direta

import "../styles/cadastro.css";
import urso from "../assets/img/urso.png";

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        // Mostra o erro retornado pelo FastAPI (ex: "Email já cadastrado")
        alert(data.detail || "Erro ao realizar cadastro.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
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
  );
}