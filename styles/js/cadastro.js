const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const resposta = await fetch(
            "http://localhost:8000/cadastro",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    nome: document.getElementById("nome").value,
                    senha: document.getElementById("senha").value
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.detail || "Erro ao cadastrar");
            return;
        }

        alert("Cadastro realizado com sucesso!");

        window.location.href = "login.html";

    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível conectar ao servidor."
        );

    }

});