const menu = document.querySelector('.nav');
const buttonBurger = document.querySelector('.burger');


function toggleMenu() {
    menu.classList.toggle('nav--open');
    buttonBurger.classList.toggle('burger--close');
}

buttonBurger.addEventListener('click', toggleMenu);