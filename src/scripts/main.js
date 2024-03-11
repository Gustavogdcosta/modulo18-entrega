document.addEventListener('DOMContentLoaded', function () {//o documento, por causa do .addEventListener, será executado uma função de callback após uma ação ou reação, no caso o DOMContentLoaded,
    //que quer dizer que o JS só vai ser executado quando todos os recuros da página forem executados
    document.getElementById('form-sorteador').addEventListener('submit', function(evento){ //o formulario com o id mostrado recebe uma função de callback
        evento.preventDefault();
        let numeromaximo = document.getElementById ('numero-maximo').value;
        numeromaximo = parseInt (numeromaximo);

        let numeroAleatorio = Math.random()*numeromaximo;
        numeroAleatorio = Math.floor(numeroAleatorio +1 ) ;

        document.getElementById('resultado-valor').innerText = numeroAleatorio;
        document.querySelector('.resultado').style.display = 'block';
    })
})