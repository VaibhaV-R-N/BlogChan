canvas.style.display = 'none'
blog = JSON.parse(blog)

const textList = blog.textList
const textStyleList = blog.textStyleList

const files = blog.files?blog.files : undefined
const fileIndExt = blog.fileIndExt? blog.fileIndExt:undefined


const imgExt = ['jpg','jpeg','png','PNG','JPEG','JPG']
const blogContainer = document.createElement('article')
blogContainer.classList.add('art')
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

    p.innerHTML = text
    p.style.fontSize = fontsize + 'px'


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
document.body.append(blogContainer)




const commentCont = document.createElement('div')
const CommentClass = class{
    constructor(username,date,comment){
        this.username = username,
        this.date = date,
        this.comment = comment
        this.container = document.createElement('div')
        this.container.classList.add('container')
        this.userName = document.createElement('h4')
        this.a = document.createElement('a')
        this.a.href = 
        this.Date = document.createElement('h4')
        this.Comment = document.createElement('p')
        this.userName.innerHTML = this.username
        this.Date.innerHTML = this.date
        this.Comment.innerHTML = this.comment
        this.container.appendChild(this.userName)
        this.container.appendChild(this.Comment)
        this.container.appendChild(this.Date)

        commentCont.appendChild(this.container)

    }
}

commentCont.classList.add('commentCont')
const h2 = document.createElement('h2')
h2.innerHTML = "Leave a comment..."
h2.classList.add('comment-heading')
const textarea = document.createElement('textarea')
const submit = document.createElement('button')
submit.textContent = 'submit'
commentCont.appendChild(h2)
commentCont.appendChild(textarea)
commentCont.appendChild(submit)

submit.addEventListener('click',async e=>{

    if(textarea.value === ''){
        inner.innerHTML = 'Cannot submit empty comment.'
        outer.style.display = 'block'
        return
    }
    const data = new URLSearchParams()
    data.append('comment',textarea.value)
    const result = await fetch(`/blogs/${blog._id}/comment`,{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body:data
    })

    const commentObj = await result.json()
    if(commentObj.re){
        window.location.href = commentObj.re
        return
    }
    new CommentClass(commentObj.user,commentObj.date,commentObj.comment)
})

const fetchComments = async()=>{
    const result = await fetch(`/blogs/${blog._id}/comment`,{
        method:'GET',
        headers:{
            Accept:'application/json'
        }
    })

    const comments = await result.json()
    for(let comment of comments){
        new CommentClass(comment.user.username,comment.date,comment.comment)
    }
}

fetchComments()
document.body.append(commentCont)

const footer = document.querySelector('.footer')

footer.style.gridRow = '24/26'

document.body.style.gap = '0'