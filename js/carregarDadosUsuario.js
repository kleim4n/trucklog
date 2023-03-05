carregarNomeUsuario = async () => {
    document.querySelector('.user h4').innerHTML = usuario.nome.split(' ')[0];
}

carregarFotoUsuario = async () => {
    try {
        let fotoUrl = `url(${usuario.foto})`;
        document.querySelector('.user .user-img').style.backgroundImage = fotoUrl;
    } catch (error) {
        console.log(error);
    }
}

function logOut() {
    if (confirm('Deseja sair?') == false) return; 
    localStorage.removeItem('usuario');
    window.location.href = '../login/index.html';
}
try {
    usuario = JSON.parse(localStorage.usuario);
    carregarNomeUsuario();
    carregarFotoUsuario();
} catch (error) {
    alert('Você não está logado!');
    window.location.href = '../login/index.html';
}
document.querySelector('.user svg').addEventListener('click', logOut);