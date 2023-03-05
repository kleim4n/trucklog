var userListGlobal = {
  "quantidade": 0,
  "usuarios": []
};

async function listarUsuarios(userList) {
  var cont = parseInt(userList.quantidade);
  const parar = parseInt(cont);
  // document.querySelector("#quantidade").innerText = `(${cont})`;
  const ul = document.querySelector("#resposta");
  for (i = 0; i < parar; i++) {
    const li = document.createElement("li");
    li.classList.add("d-flex", "border-bottom");
    li.innerHTML = `<img
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

const criar = async () => {
  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  await fetch(`https://serverest.dev/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: `${nome}`,
      email: `${email}`,
      password: "teste",
      administrador: "true",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      if (!response) {
        alert(`${response.message}`);
        clearInputs();
        return;
      }
      alert(`${response.message}`);
      clearInputs();
      window.location.reload();
    })
    .catch((error) => console.log(error));
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

async function validarLogin() {
  userListGlobal = userListGlobal = {
    "quantidade": 0,
    "usuarios": []
  };
  await listar(`../assets/usuarios/usuarios.json`, false, true);
  await listar(`https://serverest.dev/usuarios`, false, true);
  email = document.getElementById("email").value;
  senha = document.getElementById("password").value;
  console.log(`email: ${email} senha: ${senha}`);
  let emails = userListGlobal.usuarios.map((user) => user.email);
  if (emails.includes(email)) {
    if (userListGlobal.usuarios[emails.indexOf(email)].password === senha) {
      usuarioExiste = userListGlobal.usuarios[emails.indexOf(email)];
      console.log(usuarioExiste['_id']);
      localStorage.setItem("usuario", `${usuarioExiste['_id']}`);
      window.location.href = "../meus-posts/index.html";
    } else {
      alert("Senha incorreta");
      return;
    }
  } 
  else {
    alert("Usuário não cadastrado");
    return;
  }
}