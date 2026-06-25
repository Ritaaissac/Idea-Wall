const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const resposta = await fetch(
            "http://localhost:8000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    senha: document.getElementById("senha").value
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.detail || "Erro ao fazer login");
            return;
        }

        localStorage.setItem(
            "token",
            dados.access_token
        );

        alert("Login realizado com sucesso!");

        window.location.href = "index.html";

    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível conectar ao servidor."
        );

    }

});