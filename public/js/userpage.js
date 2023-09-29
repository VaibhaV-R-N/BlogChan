const followers = document.querySelector('.followers')
const following = document.querySelector('.following')

blogUser = JSON.parse(blogUser)
user = JSON.parse(user)

const Followers = class{
    constructor(FollowArray){
        this.followArray = FollowArray
        this.container = document.createElement('div')
        this.container.classList.add('follow-container')
        for(let follow of this.followArray){
            console.log(follow);
            const inner = document.createElement('div')
            inner.classList.add('inner')
            inner.classList.add('bottomanim')
            const h4 = document.createElement('h4')
            h4.innerHTML = follow.username
            const name = document.createElement('a')
            name.classList.add('name')
            name.href = `/account/user/${follow._id}`
            name.appendChild(h4)
            inner.appendChild(name)

            const followBtn = document.createElement('button')
            followBtn.textContent = 'follow'
            const followBtnA = document.createElement('a')
            followBtnA.classList.add('follow-btn')
            followBtnA.href = `/account/user/${follow._id}/follow`
            followBtnA.appendChild(followBtn)

            const removeBtn = document.createElement('button')
            removeBtn.textContent = 'remove'
            const removeBtnA = document.createElement('a')
            removeBtnA.classList.add('remove-btn')
            removeBtnA.href = `/account/user/${follow._id}/remove`
            removeBtnA.appendChild(removeBtn)

            if(!this.youFollowing(follow._id) && follow._id !== user._id){
                inner.appendChild(followBtnA)
            }

            if(blogUser._id === user._id){
                inner.appendChild(removeBtnA)
            }
            this.container.appendChild(inner)
            document.querySelector('.myblog').parentNode.insertBefore(this.container,document.querySelector('.myblog'))
           
        }
        
    }

    youFollowing(id){
        return user.following.indexOf(id) === -1?false:true
    }

}

const Following = class{
    constructor(FollowArray){
        this.followArray = FollowArray
        this.container = document.createElement('div')
        this.container.classList.add('following-container')
        for(let follow of this.followArray){
            console.log(follow);
            const inner = document.createElement('div')
            inner.classList.add('inner')
            inner.classList.add('bottomanim')
            const h4 = document.createElement('h4')
            h4.innerHTML = follow.username
            const name = document.createElement('a')
            name.href = `/account/user/${follow._id}`
            name.classList.add('name')
            name.appendChild(h4)
            inner.appendChild(name)
            const unfollowBtn = document.createElement('button')
            unfollowBtn.textContent = 'unfollow'
            const unfollowBtnA = document.createElement('a')
            unfollowBtnA.classList.add('follow-btn')
            unfollowBtnA.href = `/account/user/${follow._id}/unfollow`
            unfollowBtnA.appendChild(unfollowBtn)


            if(blogUser._id === user._id){
                inner.appendChild(unfollowBtnA)
            }
            this.container.appendChild(inner)
            document.querySelector('.myblog').parentNode.insertBefore(this.container,document.querySelector('.myblog'))
           
        }
        
    }
}

followers.addEventListener('click',async e=>{
    followers.style.pointerEvents = 'none'
    if(document.querySelector('.following-container')){
        document.body.removeChild(document.querySelector('.following-container'))
    }
    if(document.querySelector('.follow-container')){
        document.body.removeChild(document.querySelector('.follow-container'))
    }else{
        const result = await fetch(`/account/user/${blogUser._id}/followers`,{
            method:'POST',
            headers:{
                'Accept':'application/json'
            }
        })
        const blogUserFollowers = await result.json()
        if(blogUserFollowers.re){
            window.location.href = blogUserFollowers.re
            return
        }
        new Followers(blogUserFollowers)
    }
    
    followers.style.pointerEvents = 'auto'
    
    

})

following.addEventListener('click',async e=>{
    following.style.pointerEvents = 'none'
    if(document.querySelector('.follow-container')){
        document.body.removeChild(document.querySelector('.follow-container'))
    }
    
    if(document.querySelector('.following-container')){
        document.body.removeChild(document.querySelector('.following-container'))
    }
    else{
        const result = await fetch(`/account/user/${blogUser._id}/following`,{
            method:'POST',
            headers:{
                'Accept':'application/json'
            }
        })
        const blogUserFollowers = await result.json()
        if(blogUserFollowers.re){
            window.location.href = blogUserFollowers.re
            return
        }
        new Following(blogUserFollowers)
    }
    following.style.pointerEvents = 'auto'
})

const footer = document.querySelector('.footer')

footer.style.gridRow = '15/17'