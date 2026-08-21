# Requisitos Idea Wall

# Requisitos Funcionais


### RF01 - Cadastrar Usuário

**Descrição:**
O sistema deve permitir que novos usuários realizem seu cadastro para acessar a plataforma.

**Dados necessários:**
* Nome;
* E-mail;
* Senha;

**Regras:**
* Todos os campos obrigatórios devem ser preenchidos;
* O e-mail deve possuir formato válido;
* O sistema deve impedir o cadastro de um e-mail já utilizado;
* O sistema deve informar o usuário caso algum dado seja inválido.

**Pós-condição:**
Após o cadastro realizado com sucesso, o usuário poderá realizar login na plataforma.

---

### RF02 - Logar Usuário

**Descrição:**
 O sistema deve permitir que usuários cadastrados acessem suas contas por meio de suas credenciais.

**Dados necessários:**
* E-mail;
* Senha

**Regras:**
* O sistema deve verificar se o e-mail está cadastrado;
* O sistema deve verificar se a senha corresponde à conta;
* O sistema deve informar o usuário caso as credenciais sejam inválidas.

**Pós-condição:**
Após a autenticação bem-sucedida, o usuário deve ser direcionado para a área principal da plataforma.

---

### RF03 - Criar quadros

**Descrição:**
O sistema deve permitir que usuários autenticados criem novos quadros para organizar suas tarefas.

**Dados necessários:**
* Nome do quadro

**Regras:**
* O nome do quadro deve ser informado;
* O sistema deve permitir a criação de múltiplos quadros;
* O quadro criado deve ser associado ao usuário responsável pela criação.

**Pré-condição:**
O usuário deve estar autenticado.

**Pós-condição:**
Após a criação, o novo quadro deve ficar disponível para o usuário visualizar e adicionar tarefas.

---

### RF04 - Excluir quadros

**Descrição:**
O sistema deve permitir que usuários autenticados excluam quadros criados por eles.

**Regras:**
* O usuário deve selecionar o quadro que deseja excluir;
* O sistema deve solicitar a confirmação da exclusão;
* Somente o usuário responsável pelo quadro poderá excluí-lo;
* Após a confirmação, o quadro deve ser removido da área do usuário.

**Pré-condição:**
O usuário deve estar autenticado e possuir pelo menos um quadro criado.

**Pós-condição:**
O quadro selecionado deve deixar de ser disponibilizado ao usuário.

---

### RF05 - Criar Tarefas

**Descrição:**
O sistema deve permitir que usuários autenticados criem tarefas dentro de seus quadros.

**Dados necessários:**
* Título da tarefa;
* Descrição da tarefa, caso disponível;
* Quadro ao qual a tarefa será vinculada.

**Regras:**
* O título da tarefa deve ser informado;
* A tarefa deve estar vinculada a um quadro existente;
* A tarefa criada deve ser associada ao usuário responsável pelo quadro.

**Pré-condição:**
O usuário deve estar autenticado e possuir um quadro disponível.

**Pós-condição:**
A nova tarefa deve ser apresentada dentro do quadro selecionado.

---

### RF06 - Editar Tarefa

**Descrição:**
O sistema deve permitir que usuários autenticados alterem as informações de tarefas existentes.

**Dados que poderão ser alterados:**
* Título;
* Descrição;
* Demais informações disponibilizadas pelo sistema.

**Regras:**
* O usuário deve selecionar uma tarefa existente;
* Somente o usuário responsável pela tarefa poderá realizar sua edição;
* O sistema deve salvar as alterações realizadas.

**Pré-condição:**
O usuário deve estar autenticado e possuir uma tarefa cadastrada.

**Pós-condição:**
A tarefa deve apresentar as informações atualizadas.

---

### RF07 - Excluir Tarefa

**Descrição:**
O sistema deve permitir que usuários autenticados excluam tarefas existentes em seus quadros.

**Regras:**
* O usuário deve selecionar a tarefa que deseja excluir;
* O sistema deve solicitar a confirmação da exclusão;
* Somente o usuário responsável pela tarefa poderá excluí-la;
* Após a confirmação, a tarefa deve ser removida do quadro.

**Pré-condição:**
O usuário deve estar autenticado e possuir uma tarefa cadastrada.

**Pós-condição:**
A tarefa selecionada deve ser removida do quadro.

---

### RF08 - Fazer logout

**Descrição:**
O sistema deve permitir que o usuário autenticado encerre sua sessão na plataforma.

**Regras:**
* O usuário deve possuir uma sessão autenticada;
* Ao realizar o logout, a sessão deve ser encerrada;
* O usuário não poderá acessar funcionalidades restritas sem realizar uma nova autenticação.

**Pré-condição:**
O usuário deve estar autenticado.

**Pós-condição:**
Após o encerramento da sessão, o usuário deve ser redirecionado para uma página pública, preferencialmente a página de login.

### RF09 — Alterar senha

**Descrição**
 O sistema deve permitir que usuários autenticados alterem sua senha de acesso exclusivamente por meio da página de perfil.

**Dados necessários:**
* Senha atual;
* Nova senha;
* Confirmação da nova senha.

**Regras:**
* O usuário deve estar autenticado;
* A alteração da senha deve ser realizada somente pela página de perfil;
* O sistema deve verificar se a senha atual está correta;
* A nova senha deve ser informada;
* A confirmação da nova senha deve ser igual à nova senha;
* O sistema deve informar o usuário caso algum dado seja inválido;
* Após a alteração, a nova senha deverá ser utilizada nos próximos acessos à plataforma.

**Pré-condição:**
O usuário deve estar autenticado e acessar sua página de perfil.

**Pós-condição:**
A senha do usuário deve ser atualizada com sucesso, permitindo que ele utilize a nova senha em futuras autenticações.


# Requisitos não funcionais

### RNF01 - Segurança

**Descrição:** 
O sistema deve proteger os dados dos usuários, especialmente suas senhas, que não devem ser armazenadas em texto simples.

---

### RNF02 - Usabilidade

**Descrição:**
O sistema deve possuir uma interface simples, intuitiva e de fácil utilização.

---

### RNF03 - Desempenho

**Descrição:**
O sistema deve apresentar tempo de resposta adequado durante a utilização de suas funcionalidades.

---

### RNF04 - Compatibilidade

**Descrição:**
O sistema deve funcionar corretamente nos principais navegadores, como Google Chrome, Microsoft Edge e Mozilla Firefox.

---

### RNF05 - Responsividade

**Descrição:**
O sistema deve adaptar sua interface a diferentes tamanhos de tela, permitindo o uso em computadores e dispositivos móveis.

---

### RNF06 - Integridade de dados

**Descrição:**
O sistema deve garantir que os dados cadastrados sejam armazenados corretamente, mantendo a associação entre usuários, quadros e tarefas.































