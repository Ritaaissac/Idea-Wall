import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const response = await fetch(
      "http://localhost:8000/cadastro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    if (response.ok) {
      navigate("/login");
    }
  }

  return (
    <div className="container">
      <div className="left">
        <h1>
          Faça o seu
          <span className="texto2">
            cadastro
          </span>
        </h1>

        <div className="urso">
          <img src={urso} alt="" />
        </div>
      </div>

      <div className="right">
        <form
          className="form-box"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Email"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Nome"
            onChange={(e) =>
              setForm({
                ...form,
                nome: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Senha"
            onChange={(e) =>
              setForm({
                ...form,
                senha: e.target.value,
              })
            }
          />

          <button className="btn-cadastro">
            Cadastrar →
          </button>
        </form>
      </div>
    </div>
  );
}