const items = document.querySelectorAll('.features__item');
const dots = document.querySelectorAll('.dots__item');

function changeItem(event, dotIndex) {
    items.forEach( (item, index) => {
        (index === dotIndex)
            ? item.classList.add('features__item--active')
            : item.classList.remove('features__item--active') ;
    });

    dots.forEach((dot, index) => {
        if (index === dotIndex) {
            dot.classList.add('dots__item--active')
        } else {
            dot.classList.remove('dots__item--active')
        }
    })

}

dots.forEach((dot, index) => dot.addEventListener('click', (event) => changeItem(event, index)));