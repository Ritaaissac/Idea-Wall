import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/login.css";
import urso from "../assets/img/urso.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔑 Salva o token gerado pelo FastAPI
        localStorage.setItem("token", data.access_token);
        // ➡️ Redireciona para o painel protegido
        navigate("/dashboard");
      } else {
        // Exibe a mensagem de erro vinda do seu backend (ex: "Senha inválida")
        alert(data.detail || "Erro ao fazer login. Verifique suas credenciais.");
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
          <span className="texto2"> login</span>
        </h1>

        <div className="urso">
          <img src={urso} alt="" />
        </div>
      </div>

      <div className="right">
        <form className="form-box" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email} // Controlando o input
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Senha"
              value={senha} // Controlando o input
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="cadastro">
            <Link to="/cadastro">Ainda não está cadastrado?</Link>
          </div>

          <button type="submit" className="btn-login">
            Login →
          </button>
        </form>
      </div>
    </div>
  );
}