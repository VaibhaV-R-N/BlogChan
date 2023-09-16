blog = JSON.parse(blog)

const textList = blog.textList
const textStyleList = blog.textStyleList

const files = blog.files?blog.files : undefined
const fileIndExt = blog.fileIndExt? blog.fileIndExt:undefined


const imgExt = ['jpg','jpeg','png','PNG','JPEG','JPG']
const blogContainer = document.createElement('article')
blogContainer.classList.add('article')
const ElementList = []
const appendBreak = ()=>{
    for(let i = 0;i< 2;i++){
       blogContainer.appendChild(document.createElement('br'))
    }
}



for(let i = 0 ;i < textList.length;i++){
    
    let text = textList[i]
    const textstyle = textStyleList[i]
    const fontsize = parseInt(textstyle.split('-')[0])
    const decoration = parseInt(textstyle.split('-')[1])

    if(decoration === 1){
        text = `<b>${text}</b>`
    }
    if(decoration === 2){
        text = `<i>${text}</i>`
    }
    if(decoration === 3){
        text = `<b>${text}</b>`
        text = `<i>${text}</i>`
    }

    const p = document.createElement('p')
    // p.classList.add('p')
    p.innerHTML = text
    p.style.fontSize = fontsize + 'px'
    p.style.color = '#F8FF95'


    ElementList.push(p)
    // appendBreak()
}


let count  = 1 
if(files){
    for(let fileInfo of fileIndExt){
        const fileInd = fileIndExt.indexOf(fileInfo)
        let ind = parseInt(fileInfo.split('-')[0])
        if(fileInd!== 0) ind += count++
        const ext = fileInfo.split('-')[1]
        
        const file = files[fileInd]
        
        if(imgExt.indexOf(ext)!==-1){
            
            const img = new Image()
            img.src = file.path
            img.classList.add('image')
            ElementList.splice(ind,0,img)
            // appendBreak()
            

        }

        if(ext === 'mp4'){
            const video = document.createElement('video')
            video.autoplay = false
            video.muted = true
            video.controls = true
            video.src = file.path
            video.classList.add('image')
            ElementList.splice(ind,0,video)
            // appendBreak()

        }

        if(ext === 'mp3'){
            const audio = new Audio()
            audio.autoplay = false
            audio.muted = true
            audio.controls = true
            audio.src = file.path
            audio.classList.add('image')
            ElementList.splice(ind,0,audio)
            // appendBreak()

        }
        
        }

}

for(element of ElementList){
    blogContainer.appendChild(element)
    appendBreak()
}
document.body.appendChild(blogContainer)