const outer = document.querySelector('.error')
const inner = document.querySelector('.error-msg')

console.log(message,Status);
if(message!=='undefined' && message!==''){
   outer.style.display = 'block'
   inner.innerHTML = message 
}

outer.addEventListener('click',e=>{
    if(getComputedStyle(outer).display === 'block'){
        outer.style.display ='none'
        inner.innerHTML = ''
    }
    
})