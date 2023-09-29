const icon  = document.querySelector('.hamburger-icon')
const menu  = document.querySelector('.hamburger-container')

icon.addEventListener('click',e=>{
    if(getComputedStyle(menu).display === 'none'){
        menu.style.display = 'block'
    }  
})


menu.addEventListener('click',e=>{
    menu.style.display = 'none'
})