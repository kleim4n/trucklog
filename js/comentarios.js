// Referência: https://github.com/cristijung/JsModule/blob/main/Aula07/app-comment/js/script06-api.js
try {
  comentarios = JSON.parse(localStorage.comentarios);
  for (let i = 0; i < comentarios.lista.length; i++) {
    comentarios.lista[i] = JSON.parse(comentarios.lista[i]);
  }
} catch (e) {
  localStorage.removeItem("comentarios");
  comentarios = { lista: [] };
  localStorage.comentarios = JSON.stringify(comentarios);
  console.log(e);
}

const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const sendCommentBtn = document.querySelector("#send-comment");
const emailInput = document.querySelector("#email-comment");
const bodyInput = document.querySelector("#body");

const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
</svg>`;

async function getAllPosts() {
  const response = await fetch(url);
  const data = await response.json();
  loadingElement.classList.add("hide");

  for (let i = 0; i < 5; i++) {
    const post = data[i];
    const div = document.createElement("div");

    div.id = `post-${post.id}`;

    div.innerHTML = createCommentSection(post.id, post.title, post.body);

    postsContainer.appendChild(div);
  }
}
getAllPosts();

async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();

  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  dataComments.map((comment) => {
    createComment(comment);
  });
}

function createComment(comment) {
  const div = document.createElement("div");
  div.innerHTML = createCommentSection(comment.id, comment.email, comment.body);

  commentsContainer.appendChild(div);
}

const createCommentSection = (id, email, body) => {
  return `<section class="comment">
        <div class="comment-header">
            <h4>${email}</h4>
            <p>
              Data de envio:
              <small>03/03/2023</small>
            </p>
            <p>
              Avaliação:
              <span class="post-${id} rating">
              ${starIcon}
              ${starIcon}
              ${starIcon}
              ${starIcon}
              ${starIcon}
              </span>
            </p>
        </div>
        <div class="comment-content">
            <p>${body}</p>
        </div>
    </section>`;
};

function getComentarios() {
  if (comentarios.lista.length == 0) {
    return;
  }
  const contador = comentarios.lista.length;
  for (let i = 0; i < contador; i++) {
    createComment(comentarios.lista[i]);
  }
}
getComentarios();

async function postComment(comment) {
  const response = await fetch(url, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();

  createComment(data);
}

commentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let comment = {
    email: emailInput.value,
    body: bodyInput.value,
  };

  comment = JSON.stringify(comment);

  comentarios.lista.push(comment);
  localStorage.comentarios = JSON.stringify(comentarios);

  postComment(comment);

  emailInput.value = "";
  bodyInput.value = "";
});
