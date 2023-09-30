const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let mouseX = undefined
let mouseY = undefined
let prevX = undefined
let prevY = undefined

const resizeCanvas = ()=>{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

window.addEventListener('mousemove',(e)=>{
    prevX = mouseX
    prevY = mouseY
    mouseX  = e.clientX
    mouseY  = e.clientY

})

window.addEventListener('touchmove',(e)=>{
    if(dragging === true){
        prevX = mouseX
        prevY = mouseY
        mouseX  = e.touches[0].clientX
        mouseY  = e.touches[0].clientY
    }

})


resizeCanvas()

window.addEventListener('resize',resizeCanvas)

const Ball = class {
    constructor(){
        this.radius = Math.floor(Math.random()*20)+1
        this.x = Math.floor(Math.random() * window.innerWidth-10)+10
        this.y = Math.floor(Math.random() * window.innerHeight-10)+10
        this.constX = this.x
        this.constY = this.y
        this.bound = 50
        this.speed = Math.random()*1.5 + 0.5
    }

    update(){
        if(mouseX!== undefined && prevX!== undefined){
            if(mouseX>prevX){
                const tempX = this.x-this.speed
                if(tempX>this.constX-this.bound && tempX < this.constX+this.bound)
                    this.x = tempX
            }
            if(mouseX<prevX){
                const tempX = this.x+this.speed
                if(tempX>this.constX-this.bound && tempX < this.constX+this.bound)
                    this.x = tempX
            }
            if(mouseY>prevY){
                const tempY = this.y-this.speed
                if(tempY>this.constY-this.bound && tempY < this.constY+this.bound)
                    this.y = tempY
            }
            if(mouseY<prevY){
                const tempY = this.y+this.speed
                if(tempY>this.constY-this.bound && tempY < this.constY+this.bound)
                    this.y = tempY
            }
        }
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)
        ctx.fillStyle= '#6A0DAD'
        ctx.fill()
        ctx.closePath()
    }
}

const ballsList = []
for(let i = 0;i < 35;i++){
    ballsList.push(new Ball())
}

const animate = ()=>{
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight)

    for(let ball of ballsList){
        ball.update()
        ball.draw()
        
    }
    requestAnimationFrame(animate)
}

animate()