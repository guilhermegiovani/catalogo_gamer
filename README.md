# 🎮 Catálogo Gamer

Aplicação **fullstack** para **catalogar(admin), favoritar e avaliar jogos**, com sistema completo de **autenticação, reações (like/dislike)** e **controle de acesso** para administradores e usuários comuns. Usuários podem **gerenciar seu perfil** (foto, senha e e-mail), **acompanhar suas avaliações** e **visualizar seus jogos favoritados.**

---

## 🎯 Propósito do Projeto

O **Catálogo de jogos** foi desenvolvido com o objetivo de consolidar conhecimentos em **desenvolvimento fullstack**, integrando **frontend (React, Vite e Tailwind)** com **backend (Node.js, Express e bancos relacionais).**
O foco principal foi compreender o fluxo completo de uma aplicação moderna: desde o **login e controle de sessão com JWT**, até o **CRUD de jogos e usuários, favoritos, sistema de avaliações** e **gestão de perfil.**
O projeto utiliza **MySQL em ambiente de desenvolvimento** e **PostgreSQL (Neon.tech) em produção**, garantindo compatibilidade entre bancos e um deploy completo na **Vercel**.

---

## 🧰 Linguagens e Tecnologias

### Frontend

<p align="left">
  <img
   align="left"
   alt="HTML"
   title="HTML"
   width="30px"
   style="padding-right: 10px;"
   src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
/>
<img
   align="left"
   alt="CSS"
   title="CSS"
   width="30px"
   style="padding-right: 10px;"
   src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
/>
<img
   align="left"
   alt="JavaScript"
   title="JavaScript"
   width="30px"
   style="padding-right: 10px;"
   src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
/>
<img
   align="left"
   alt="ReactJs"
   title="ReactJs"
   width="30px"
   style="padding-right: 10px;"
   src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
/>
<img
   align="left"
   alt="Vite"
   title="Vite"
   width="30px"
   style="padding-right: 10px;"
   src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg"
/>

<img
    align="left"
    alt="Tailwind CSS"
    title="Tailwind CSS"
    width="30px"
    style="padding-right: 10px;"
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
    />

</p>

<br>

### Versionamento e ferramentas

<p>
    <img
        align="left"
        alt="Git"
        title="Git"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"
    />
    <img
        align="left"
        alt="GitHub"
        title="GitHub"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
    />
    <img
        align="left"
        alt="NPM"
        title="NPM"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg"
    />
</p>

<br>
  
### Backend
<p>
    <img
        align="left"
        alt="NodeJs"
        title="NodeJs"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
    />
    <img
        align="left"
        alt="Express"
        title="Express"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg"
    />
</p>

<br>
  
### Bancos de dados
<p>
    <img
        align="left"
        alt="MySQL"
        title="MySQL"
        width="35px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg"
    />
    <img
        align="left"
        alt="PostgreSQL"
        title="PostgreSQL"
        width="35px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-plain.svg"
    />
</p>

<br>
<br>

> 💾 **Banco de dados:**
>
> - 🧪 Desenvolvimento: **MySQL (local)**
> - 🚀 Produção: **PostgreSQL (Neon.tech)**

---

## 💡 Funcionalidades

- Cadastro/Login de usuários
- CRUD completo de jogos
- Favoritos (salvar/remover)
- Avaliações/Comentários e reações (like/dislike)
- Filtros e busca por nome
- Controle de acesso (admin x usuário comum)
- Integração completa entre frontend e backend

---

## 🌐 Deploy

- Catálogo de Jogos: [https://catalogo-gamer.vercel.app/](https://catalogo-gamer.vercel.app/)

---

## 🏗️ Arquitetura do Projeto

```text
Frontend (React + Vite + Tailwind)
           ↓
         Axios
           ↓
Backend (Node.js + Express)
           ↓
Banco de Dados
├─ 💻 Desenvolvimento → MySQL (local)
└─ ☁️ Produção → PostgreSQL (Neon.tech)
```

---

## 🖼️ Pré-visualização

<p align="center">
  <div align="center">
     <em>Home</em>
     <br>
     <img src="./prints/home.png" alt="Home" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Page Games</em>
     <br>
     <img src="./prints/pageGames.png" alt="Page Games" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Reviews</em>
     <br>
     <img src="./prints/reviews1.png" alt="Reviews" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Reviews</em>
     <br>
     <img src="./prints/reviews2.png" alt="Reviews" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Profile</em>
     <br>
     <img src="./prints/profile1.png" alt="Tela de perfil" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Profile</em>
     <br>
     <img src="./prints/profile2.png" alt="Tela de perfil" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Admin</em>
     <br>
     <img src="./prints/admin.png" alt="Tela de admin" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Add new Game</em>
     <br>
     <img src="./prints/addNewGame.png" alt="Add new game" width="80%">
  </div>
  <br>

  <div align="center">
     <em>Edit game</em>
     <br>
     <img src="./prints/editGame.png" alt="Edit game" width="80%">
  </div>
</p>

---

## 🧠 Aprendizados

Durante o desenvolvimento deste projeto, pratiquei:
- Integração entre **frontend e backend** utilizando **Axios**;
- **Autenticação e autorização** com **JWT**;
- **Relacionamentos entre tabelas** (usuário ↔ jogos ↔ avaliações), (usuário ↔ jogos ↔ favoritos);
- Deploy completo com **Vercel** e **Neon.tech**;
- Configuração de ambientes distintos (**MySQL local** e **PostgreSQL em produção**);
- Estilização responsiva e componentização com **Tailwind CSS**.

---

## 👨‍💻 Autor

Desenvolvido por **[Guilherme Giovani](https://github.com/guilhermegiovani).**  
Projeto criado com o objetivo de praticar e demonstrar habilidades em **React**, **Node.js**, **Express**, **TailwindCSS**, **MySQL** e **PostgreSQL (Neon.tech)**.
