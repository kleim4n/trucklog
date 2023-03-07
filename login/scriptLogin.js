var userListGlobal = {
  "quantidade": 0,
  "usuarios": []
};

async function listarUsuarios(userList) {
  // var cont = parseInt(userList.quantidade);
  // const parar = parseInt(cont);
  // document.querySelector("#quantidade").innerText = `(${cont})`;
  const ul = document.querySelector("#resposta");
  for (i = 0; i < userList.usuarios.length; i++) {
    const li = document.createElement("li");
    li.classList.add("d-flex", "border-bottom");
    li.innerHTML = `<img
                      alt="Foto ${userList.usuarios[i].nome}"
                      src="${(userList.usuarios[i].foto != undefined) ? (userList.usuarios[i].foto) : '../assets/usuarios/profiles/gabriel.png'}"
                      width="32"
                      height="32"
                      class="flex-shrink-0 me-2 rounded"
                      style="background-color: ${randomColor()};"
                    />

                    <p class="pb-3 mb-3 small lh-sm">
                      <strong
                        class="d-block text-gray-dark"
                      >${userList.usuarios[i].nome}</strong>
                      <strong
                        class="d-block text-primary fst-italic"
                      >${userList.usuarios[i].email}</strong>
                    </p>`;
    ul.appendChild(li);
  }
}

const listar = async (origem, listHMTL = true, toUserListGlobal = true) => {
  await fetch(origem, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((userList) => {
      if (userList.length === 0) {
        document.getElementById(
          "resposta"
        ).innerHTML = `<h5>Nenhum usuário cadastrado</h5>`;
        return;
      }
      if (toUserListGlobal) cadastrarEmUserListGlobal(userList);
      if (listHMTL) listarUsuarios(userList);
    });
};

function cadastrarEmUserListGlobal(userList) {
  userListGlobal.quantidade += userList.quantidade;
  userListGlobal.usuarios = userListGlobal.usuarios.concat(userList.usuarios);
}

const readFromLocalStorage = () => {
  let users = JSON.parse(localStorage.usuariosCriados);
  if (users) {
    userListGlobal.quantidade += users.quantidade;
    userListGlobal.usuarios = userListGlobal.usuarios.concat(users.usuarios.map((user) => JSON.parse(user)));
  }
}

const criar = async () => {
  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  localStorage.usuarioCriado = `{
        "nome": "${nome}",
        "email": "${email}",
        "password": "${password}",
        "administrador": "false",
        "_id": "0uxuPY0cbmQhpEz4",
        "foto": "../assets/usuarios/profiles/gabriel.png"}`;
  alert('Usuário criado com sucesso!');
  window.location.href = "../login/index.html";

  // await fetch(`https://serverest.dev/usuarios`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     nome: `${nome}`,
  //     email: `${email}`,
  //     password: "teste",
  //     administrador: "true",
  //   }),
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error(`HTTP error: ${response.status}`);
  //     }
  //     return response.json();
  //   })
  //   .then((response) => {
  //     if (!response) {
  //       alert(`${response.message}`);
  //       clearInputs();
  //       return;
  //     }
  //     alert(`${response.message}`);
  //     clearInputs();
  //     window.location.reload();
  //   })
  //   .catch((error) => console.log(error));
};

const clearInputs = () => {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
};

const randomColor = () => {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

const padraoEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

async function validarLogin() {
  userListGlobal = userListGlobal = {
    "quantidade": 0,
    "usuarios": []
  };
  email = document.getElementById("email").value;
  if (!padraoEmail.test(email)) {return alert("Email inválido");}
  senha = document.getElementById("password").value;
  if (senha.length == 0) {return alert("Senha vazia");}
  await listar(`../assets/usuarios/usuarios.json`, false, true);
  await listar(`https://serverest.dev/usuarios`, false, true);
  let emails = userListGlobal.usuarios.map((user) => user.email);
  if (emails.includes(email)) {
    if (userListGlobal.usuarios[emails.indexOf(email)].password === senha) {
      usuarioExiste = userListGlobal.usuarios[emails.indexOf(email)];
      console.log(usuarioExiste['_id']);
      localStorage.setItem("usuario", JSON.stringify(usuarioExiste));
      window.location.href = "../meus-posts/index.html";
    } else {
      alert("Senha incorreta");
      return;
    }
  }
  else {
    usuarioCriado = JSON.parse(localStorage.usuarioCriado);
    if (usuarioCriado) {
      if (usuarioCriado.email === email) {
        if (usuarioCriado.password === senha) {
          localStorage.setItem("usuario", JSON.stringify(usuarioCriado));
          window.location.href = "../meus-posts/index.html";
        } else {
          alert("Senha incorreta");
          return;
        }
      } 
    }
    else  {
      alert("Usuário não cadastrado");
      return;
    }
  }
}