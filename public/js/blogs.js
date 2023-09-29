const blogCards = document.querySelectorAll('.blog-card')


for(let blogCard of blogCards){
    const id = blogCard.querySelector('.id').value
    const upVote = blogCard.querySelector('.upvote')
    const downVote = blogCard.querySelector('.downvote')
    const upVoteNo = blogCard.querySelector('.uno')
    const downVoteNo = blogCard.querySelector('.dno')

    upVote.addEventListener('click',async e=>{
        e.preventDefault()

        const result  = await fetch(`/blogs/${id}/upvote`,{
            method:'POST',
            headers:{
                Accept:'application/json'
            }
            
        })

        const vote = await result.json()
        if(vote.re){
            window.location.href = vote.re
            return
        }
        upVoteNo.innerHTML = vote.up
        downVoteNo.innerHTML = vote.down


    })

    downVote.addEventListener('click',async e=>{
        e.preventDefault()
        const result  = await fetch(`/blogs/${id}/downvote`,{
            method:'POST',
            headers:{
                Accept:'application/json'
            }
            
        })

        const vote = await result.json()
        if(vote.re){
            window.location.href = vote.re
            return
        }
        upVoteNo.innerHTML = vote.up
        downVoteNo.innerHTML = vote.down

    })
}