

const quote = document.querySelector('.quote')
const quotes = ['Welcome ^_^','"Unlocking new perspectives, one blog at a time."',
                '"Inspiring minds, one post at a click."',
                '"Where anonymity reigns, your secrets are safe, and your voice is free."']

                
let quoteInd = 0;

let index = 0

const sleep = (ms)=>{
    return new Promise(resolve => setTimeout(resolve,ms))
}

let count = 1
setInterval(async()=>{
    const actualLength = quotes[quoteInd].length
    if(index < actualLength){
        if(count++ % 3 === 0){
            quote.innerHTML = quotes[quoteInd].substring(0,index+1)+'_'
        }
        else
            quote.innerHTML = quotes[quoteInd].substring(0,index+1)

        if(index === actualLength-1) await sleep(500)
        index++
    }else{
        if(quoteInd < quotes.length-1){
            quoteInd++
            index = 0
        }
        else{
            quoteInd = 0
            index = 0
            count = 1
        }
    }

},125)