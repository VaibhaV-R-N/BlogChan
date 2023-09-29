const blogContainer =  document.querySelector('.blog-container')


const variables = {
    order:false,
    edit:false,
    currentlyEditing:undefined,
    file:undefined,
    bold:false,
    italic:false
}
const textStyleList = []
const textList = []
const fileIndExt = []
const files = []

const textareaCont = document.querySelector('.textarea-cont')
const textBtn = document.querySelector('.text')
const textarea = textareaCont.querySelector('textarea')

textBtn.addEventListener('click',e=>{
    if(getComputedStyle(textareaCont).visibility === 'hidden'){
        textareaCont.style.visibility = 'visible'
        textarea.focus()
    }
    else{
        textareaCont.style.visibility = 'hidden'
    }
})

const article = blogContainer.querySelector('article')

const addTxtBtn = document.querySelector('.submit-text') 
const fontSize = document.querySelector('#fontsize')
fontSize.value = 16

fontSize.addEventListener('change',e=>{

    try {
        const value = parseInt(fontSize.value)
        if(value=== NaN){
  
            fontSize.value = 16
        }else {
           
            fontSize.value = value
        }
        if(fontSize.value<0){
            fontSize.value = 16
        }
        if(fontSize.value >64){
            fontSize.value = 64
        }
    } catch (error) {
        fontSize.value = 16
    }

   
   
})

const getTextStyle = ()=>{
    let styleNum = 0
    if(variables.bold){
        this.text = `<b>${this.text}</b>`
        styleNum+=1
    }
    if(variables.italic){
        this.text = `<i>${this.text}</i>`
        styleNum+=2
    }

    return `${fontSize.value}-${styleNum}`

}

const setTextStyle = (text)=>{
    let newText = text
    if(variables.bold){
       newText= `<b>${newText}</b>`

    }
    if(variables.italic){
        newText = `<i>${newText}</i>`

    }

    return newText
}

const updateFileIndex = (ind)=>{
    let i = 0

    if(variables.file){
        i = files.indexOf(variables.file)
        for(i;i< fileIndExt.length;i++){
            const fileInfoList = fileIndExt[i].split('-')
            const fileInd = parseInt(fileInfoList[0])
            if(fileInd >= ind){
                fileIndExt[i] = `${fileInd+1}-${fileInfoList[1]}`
            }
        }
    }else{
        for(i;i< fileIndExt.length;i++){
            const fileInfoList = fileIndExt[i].split('-')
            const fileInd = parseInt(fileInfoList[0])
            if(fileInd > ind){
                fileIndExt[i] = `${fileInd+1}-${fileInfoList[1]}`
            }
        }
    }

    
}

class Paragraph{
    constructor(text){

        this.text = text
        this.textBak = this.text
        this.p = document.createElement('p')
        this.pCont = document.createElement('div')
        this.menu = document.createElement('div')
        this.edit = document.createElement('img')
        this.delete = document.createElement('img')
        this.prepend = document.createElement('img')

        

        this.create()
    }

    create(){
        if(!variables.order){
            textStyleList.push(getTextStyle())
            textList.push(this.text)

        }
        else{
            if(variables.file){
                const preInd = parseInt(fileIndExt[files.indexOf(variables.file)].split('-')[0])
                textList.splice(preInd,0,textarea.value)
                textStyleList.splice(preInd,0,getTextStyle())
                updateFileIndex(preInd)

            }else{
                console.log(variables.currentlyEditing.innerText);
                const preInd = textList.indexOf(variables.currentlyEditing.innerText)
                textList.splice(preInd,0,textarea.value)
                textStyleList.splice(preInd,0,getTextStyle())
                updateFileIndex(preInd)
                
            }
        }

        
        this.text = setTextStyle(this.text)
        

        this.p.innerHTML= this.text
        this.p.style.fontSize = fontSize.value +'px'
        this.edit.src = '/public/assets/icons/editing.png'
        this.delete.src = '/public/assets/icons/delete.png'
        this.prepend.src = '/public/assets/icons/up.png'
        this.edit.classList.add('menu-img')
        this.delete.classList.add('menu-img')
        this.prepend.classList.add('menu-img')
        this.pCont.classList.add('pCont')
        this.menu.classList.add('menu')

        this.menu.appendChild(this.edit)
        this.menu.appendChild(this.delete)
        this.menu.appendChild(this.prepend)
        this.pCont.appendChild(this.p)
        this.pCont.appendChild(this.menu)

        this.edit.addEventListener('click',e=>{
            if(getComputedStyle(textareaCont).visibility === 'hidden'){
                textareaCont.style.visibility = 'visible'
            }
            

            textarea.value = this.p.textContent
            variables.edit = true
            variables.currentlyEditing = this.p
        })

        this.delete.addEventListener('click',e=>{
            const deleteInd = textList.indexOf(this.textBak)
            textList.splice(deleteInd,1)
            textStyleList.splice(deleteInd,1)

            for(let i = 0 ;i< fileIndExt.length;i++){
                const fileInfoList = fileIndExt[i].split('-')
                const oldInd = parseInt(fileInfoList[0])
                if(oldInd > deleteInd){
                    fileIndExt[i] = `${oldInd-1}-${fileInfoList[1]}`
                }
            }
            
            console.log(fileIndExt,files);
            article.removeChild(this.pCont)
            textarea.value = ''
            textareaCont.style.visibility = 'hidden'
            console.log(textStyleList,textList);
        })
        
        this.prepend.addEventListener('click',e=>{
            if(getComputedStyle(textareaCont).visibility === 'hidden'){
                textareaCont.style.visibility = 'visible'
            }
            variables.order = true
            variables.currentlyEditing = this.p
            

        })

        this.pCont.addEventListener('click',e=>{
            if(getComputedStyle(this.menu).visibility === 'hidden'){
                this.menu.style.visibility = 'visible'
            }
            else{
                this.menu.style.visibility = 'hidden'
            }
        })
        if(variables.order){
            variables.currentlyEditing.parentNode.parentNode.insertBefore(this.pCont,variables.currentlyEditing.parentNode)
        }else{
            article.appendChild(this.pCont)
        }
        console.log(textStyleList,textList);
        textarea.value = ''
    }
}

addTxtBtn.addEventListener('click',e=>{
    if(variables.order){
        if(textarea.value.length>0){
            

            new Paragraph(textarea.value)
            variables.order =  false
            variables.currentlyEditing = undefined
            variables.file = undefined
        }
        
        return
    }

    if(variables.edit){
        const editInd = textList.indexOf(variables.currentlyEditing.textContent)
        let textAreaVal = textarea.value
        textList.splice(editInd,1,textAreaVal)
        textStyleList.splice(editInd,1,getTextStyle())

        variables.currentlyEditing.style.fontSize = fontSize.value +'px'
        variables.currentlyEditing.innerHTML = setTextStyle(textAreaVal)
        variables.edit = false
        variables.currentlyEditing = undefined
        textarea.value = ''
        textareaCont.style.visibility = 'hidden'
        console.log(textStyleList,textList);
        return
    }
    const text = textarea.value
    if(text.length>0){
        new Paragraph(text)

    }
})

const fileInput = document.querySelector('#media')

class Media{
    constructor(file){
        
        this.file = file
        this.filename = this.file.name
        this.ext = this.filename.split('.')[1]
        this.url = URL.createObjectURL(this.file)
        this.mCont = document.createElement('div')
        this.menu = document.createElement('div')
        this.delete = document.createElement('img')
        this.prepend = document.createElement('img')

        this.delete.src = '/public/assets/icons/delete.png'
        this.delete.classList.add('menu-img')
        this.prepend.src = '/public/assets/icons/up.png'
        this.prepend.classList.add('menu-img')
        this.mCont.classList.add('pCont')
        this.menu.classList.add('menu')
        this.menu.appendChild(this.delete)
        this.menu.appendChild(this.prepend)

        this.delete.addEventListener('click',e=>{
            article.removeChild(this.mCont)
            textareaCont.style.visibility = 'hidden'

            const deleteInd = files.indexOf(this.file)

            files.splice(deleteInd,1)
            fileIndExt.splice(deleteInd,1)
            
            console.log(fileIndExt,files);
        })
        
        this.prepend.addEventListener('click',e=>{
            if(getComputedStyle(textareaCont).visibility === 'hidden'){
                textareaCont.style.visibility = 'visible'
            }
            variables.order = true
            const imgExt = ['jpg','JPG','jpeg','JPEG','png','PNG']
            for(let ext of imgExt){
                if(this.ext === ext)
                variables.currentlyEditing = this.mCont.querySelector('img')
            }

            if(this.ext === 'mp4'){
                variables.currentlyEditing = this.mCont.querySelector('video')
            }
            if(this.ext === 'mp3'){
                variables.currentlyEditing = this.mCont.querySelector('audio')
            }
            variables.file  = this.file
            

        })

        this.mCont.addEventListener('click',e=>{
            if(getComputedStyle(this.menu).visibility === 'hidden'){
                this.menu.style.visibility = 'visible'
            }
            else{
                this.menu.style.visibility = 'hidden'
            }
        })

        this.setMedia()

    }

    setMedia(){
        
        const imgExt = ['jpg','JPG','jpeg','JPEG','png','PNG']
        if(variables.order){
            if(variables.file){
                const preInd = files.indexOf(variables.file)
                const fileInd = fileIndExt[preInd].split('-')[0]
                files.splice(preInd,0,this.file)
                fileIndExt.splice(preInd,0,`${fileInd}-${this.ext}`)
            }else{
                const preInd = textList.indexOf(variables.currentlyEditing.innerText)
                files.push(this.file)
                fileIndExt.push(`${preInd}-${this.ext}`)
            }
            
        }
        else{
            fileIndExt.push(`${textList.length}-${this.ext}`)
            files.push(this.file)
        }
        console.log(fileIndExt,files);
        for(let ext of imgExt){
            if(ext === this.ext){
                this.image = new Image()
                this.image.src = this.url
                this.image.classList.add('image')
                this.mCont.appendChild(this.image)
                this.mCont.appendChild(this.menu)
                if(variables.order){
                    variables.currentlyEditing.parentNode.parentNode.insertBefore(this.mCont,variables.currentlyEditing.parentNode)
                    
                }else{
                    article.appendChild(this.mCont)
                }
                return
            }
        }

        if(this.ext === 'mp4'){
            this.video = document.createElement('video')
            this.video.autoplay = false
            this.video.muted = true
            this.video.controls = true
            this.video.src = this.url
            this.video.classList.add('image')
            this.mCont.appendChild(this.video)
            this.mCont.appendChild(this.menu)
            if(variables.order){
                variables.currentlyEditing.parentNode.parentNode.insertBefore(this.mCont,variables.currentlyEditing.parentNode)
            }else{
                article.appendChild(this.mCont)
            }
            return
        }

        if(this.ext === 'mp3'){
            this.audio = new Audio()
            this.audio.autoplay = false
            this.audio.muted = true
            this.audio.controls = true
            this.audio.src = this.url
            this.audio.classList.add('image')
            this.mCont.appendChild(this.audio)
            this.mCont.appendChild(this.menu)
            if(variables.order){
                variables.currentlyEditing.parentNode.parentNode.insertBefore(this.mCont,variables.currentlyEditing.parentNode)
            }else{
                article.appendChild(this.mCont)
            }
            return
        }
    }
}

fileInput.addEventListener('change',e=>{
   const file = fileInput.files[0]

   new Media(file)
   variables.order =  false
   variables.currentlyEditing = undefined
   variables.file = undefined
   
})

//text styling


const bold = document.querySelector('.bold')
const italic = document.querySelector('.italic')

bold.addEventListener('click',e=>{
    if(variables.bold){
        variables.bold = false
        bold.style.borderBottom = "none"
        return
    }
    variables.bold = true
    bold.style.borderBottom = "1px solid black"
})

italic.addEventListener('click',e=>{
    if(variables.italic){
        variables.italic = false
        italic.style.borderBottom = 'none'
        return
    }
    variables.italic = true
    italic.style.borderBottom = "1px solid black"
})

const confirmCont = document.querySelector('.confirm-cont')
const yes = document.querySelector('.yes')
const no = document.querySelector('.no')
const loading = document.querySelector('.loading')
const submit = document.querySelector('.submit')

confirmCont.addEventListener('click',e=>{
    if(getComputedStyle(confirmCont).display === 'block'){
        confirmCont.style.display = 'none'
    }
})

yes.addEventListener('click',async e=>{
    confirmCont.style.display ='none'
    const title = document.querySelector('.blogname').value
    if(title === '' || title === undefined){
        inner.innerHTML = 'Blog title cannot be empty.'
        outer.style.display = 'block'
        return
    }

    if(textList.length === 0){
        inner.innerHTML = 'Blog body should contain text.'
        outer.style.display = 'block'
        return
    }

    const size = 10 * 1024  * 1024
    const formData = new FormData()
    formData.append('title',title)
    for(let text of textList){
        formData.append('textList[]',text)
    }

    for(let textStyle of textStyleList){
        formData.append('textStyleList[]',textStyle)
    }

    for(let fileIE of fileIndExt){
        formData.append('fileIndExt[]',fileIE)
    }
    for(let file of files){
        if(file.size <= size){
            formData.append('files[]',file)
        }
        else{
            inner.innerHTML = 'One of the file is too large, please select a file of size less than 10MB.'
            outer.style.display = 'block'
            return
        }
        
    }

    loading.style.display = 'block'

    const res = await fetch('/newblog',{
        method:'POST',
        headers:{
            'Accept':'application/json',
        },
        body:formData
    })
    const js = await res.json()
    window.location.href = js.re
})


no.addEventListener('click',e=>{
    confirmCont.style.display = 'none'
})

submit.addEventListener('click',async(e)=>{

    confirmCont.style.display = 'block'

})

const footer = document.querySelector('.footer')

footer.style.gridRow = '14/16'

document.body.style.gap = '0'