const express = require('express')
const passport = require('passport')
const {upload,cloudinary} = require('./cloudinary')
const {User,Blog,Vote,Comment} = require('./models')
const{getDate} = require('./Utils')
const {asyncCatcher,isLoggedIn,isLoggedInBTS} = require('./middlewares')
const AppError = require('./AppError')

const root = express.Router()
const newBlog = express.Router()
const account = express.Router()

root.get('/',(req,res,next)=>{
    const message = res.locals.message?res.locals.message:undefined
    const status = res.locals.status?res.locals.status:undefined

    delete res.locals.message
    delete res.locals.status
    res.render('home',{title:'Blog-Chan',message,status})
})
.get('/blogs',asyncCatcher(async(req,res,next)=>{
    const blogs = await Blog.find().populate('user')
    const message = req.session.message?req.session.message:undefined
    const status = req.session.status?req.session.status:undefined
    if(message !== undefined && status !== undefined){
        delete req.session.message
        delete req.session.status
    }
    res.render('allblogs',{title:'blogs',blogs,message,status})
}))
.get('/blogs/:id',asyncCatcher(async(req,res,next)=>{
    const id = req.params.id
    const blog = await Blog.findById(id).populate('user')
    const message = req.session.message?req.session.message:undefined
    const status = req.session.status?req.session.status:undefined
    if(message !== undefined && status !== undefined){
        delete req.session.message
        delete req.session.status
    }
    res.render('blogpage',{title:blog.title,blog,message,status})
}))
.post('/blogs/:id/upvote',isLoggedInBTS,asyncCatcher(async(req,res,next)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    const vote = await Vote.findOne({$and: [{blog:id},{upvote: { $in:[req.user._id]}} ]})
    if(vote){
        await vote.updateOne({$pull:{upvote:req.user._id}})
        blog.upvote-=1
        await vote.save()
    }else{
        await Vote.updateOne({blog:id},{$push:{upvote:req.user._id}})
        blog.upvote+=1

        const down = await Vote.findOne({$and: [{blog:id},{downvote: { $in:[req.user._id]}} ]})
        if(down){
            await Vote.updateOne({blog:id},{$pull:{downvote:req.user._id}})
            blog.downvote-=1
        }
    }
    await blog.save()
    
    res.json({up:blog.upvote,down:blog.downvote})
}))
.post('/blogs/:id/downvote',isLoggedInBTS,asyncCatcher(async(req,res,next)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    const vote = await Vote.findOne({$and: [{blog:id},{downvote: { $in:[req.user._id]}} ]})
    if(vote){
        await vote.updateOne({$pull:{downvote:req.user._id}})
        blog.downvote-=1
        await vote.save()
    }else{
        await Vote.updateOne({blog:id},{$push:{downvote:req.user._id}})
        blog.downvote+=1

        const up = await Vote.findOne({$and: [{blog:id},{upvote: { $in:[req.user._id]}} ]})
        if(up){
            await Vote.updateOne({blog:id},{$pull:{upvote:req.user._id}})
            blog.upvote-=1
        }
    }
    await blog.save()
    
    res.json({up:blog.upvote,down:blog.downvote})
}))
.get('/blogs/:id/comment',asyncCatcher(async(req,res,next)=>{
    const comments = await Comment.find({blog:req.params.id}).populate('user')

    res.json(comments)
}))
.post('/blogs/:id/comment',isLoggedInBTS,asyncCatcher(async(req,res,next)=>{
    const {comment} = req.body
    const newComment = await new Comment({
        user:req.user._id,
        blog:req.params.id,
        comment,
        date:getDate()
    }).save()

    res.json({user:req.user.username,date:newComment.date,comment})

}))


newBlog.get('/',isLoggedIn,(req,res,next)=>{
    const message = req.session.message?req.session.message:undefined
    const status = req.session.status?req.session.status:undefined

    if(message !== undefined && status !== undefined){
        delete req.session.message
        delete req.session.status
    }
    res.render('newblog',{title:'New',message,status})
    })
    .post('/',upload.array('files[]'),asyncCatcher(async(req,res,next)=>{

        const size = 10 * 1024 * 1024
        for(let file of req.files){
            if(file.length > size){
                return next(new AppError('One of the file is too large, please select a file of size less than 10MB.',500))
            }
        }

        if(req.body.title ===  '' || req.body.title === undefined){
            return next(new AppError('Blog title cannot be empty',500))
        }

        if(req.body.textList.length ===  0 ){
            return next(new AppError('Blog body should contain text',500))
        }

        let blog = new Blog({
            user:req.user._id,
            title:req.body.title,
            textList:req.body.textList,
            textStyleList:req.body.textStyleList,
            fileIndExt:req.body.fileIndExt,
            date:getDate()
        })
        
        if(req.files){
            const files = []
            
            for(let file of req.files){
                files.push({path:file.path,filename:file.filename})
            }
            blog.files = files
        }
            
        blog = await blog.save()
        await new Vote({blog:blog._id}).save()
        res.json({'re':'/blogs'})
            
        } 
    ))

account.get('/signup',(req,res,next)=>{
    const message = req.session.message?req.session.message:undefined
    const status = req.session.status?req.session.status:undefined

    if(message !== undefined && status !== undefined){
        delete req.session.message
        delete req.session.status
    }
    
    res.render('signup',{title:'SignUp',message:message,status:status})
})
.get('/login',(req,res,next)=>{
    const message = req.session.message?req.session.message:undefined
    const status = req.session.status?req.session.status:undefined

    if(message !== undefined && status !== undefined){
        delete req.session.message
        delete req.session.status
    }
    res.render('login',{title:'Login',message,status})
})
.get('/logout',isLoggedIn,(req,res,next)=>{
    req.logOut((e)=>{
        if(e) return res.redirect('/')
        return res.redirect('/account/login')
    })
})
.post('/signup',asyncCatcher(async(req,res,next)=>{
    const formData = req.body.user
    let user
    const newUser = new User({username:formData.username,date:getDate()})
    if(formData.password === formData.cpassword){
        user = await User.register(newUser,formData.password)
    }else return next(new AppError('Password do not match.',500))
    
    req.login(user,async (err)=>{
        if(err) return res.redirect('/account/signup')
        res.locals.user = req.user?req.user:undefined
        return res.redirect(`/account/user/${user._id}`)
    })
}))
.post('/login',passport.authenticate('local',{failureRedirect:'/account/signup'}),(req,res,next)=>{
    res.locals.user = req.user
    res.redirect(`/account/user/${req.user._id}`)
})
.get('/user/:id',isLoggedIn,asyncCatcher(async(req,res,next)=>{
    const buser = await User.findById(req.params.id)
    const blogs = await Blog.find({user:buser._id}).populate('user')
    let following = await User.find({$and:[{_id:req.user._id},{following:{$in:[buser._id]}}]})
    if(following.length > 0){
        following=true
    }
    else{
        following=false
    }
    const message = req.session.message?req.session.message:undefined
    const status = req.session.status?req.session.status:undefined

    if(message !== undefined && status !== undefined){
        delete req.session.message
        delete req.session.status
    }
    res.render('userpage',{title:buser.username,buser,blogs,following,message,status})
}))
.get('/user/:id/follow',isLoggedIn,asyncCatcher(async(req,res,next)=>{
    await User.updateOne({_id:req.params.id},{$push : {followers:req.user._id}})
    await User.updateOne({_id:req.user._id},{$push:{following:req.params.id}})

    res.redirect(`/account/user/${req.params.id}`)
}))
.get('/user/:id/unfollow',isLoggedIn,asyncCatcher(async(req,res,next)=>{
    await User.updateOne({_id:req.params.id},{$pull : {followers:req.user._id}})
    await User.updateOne({_id:req.user._id},{$pull:{following:req.params.id}})

    res.redirect(`/account/user/${req.params.id}`)
}))
.post('/user/:id/followers',isLoggedInBTS,asyncCatcher(async(req,res,next)=>{
    const buser = await User.findById(req.params.id).populate('followers')

    res.json(buser.followers)


}))
.post('/user/:id/following',isLoggedInBTS,asyncCatcher(async(req,res,next)=>{
    const buser = await User.findById(req.params.id).populate('following')

    res.json(buser.following)
}))
.get('/user/:id/remove',isLoggedIn,asyncCatcher(async(req,res,next)=>{
    await User.updateOne({_id:req.user._id},{$pull:{followers:req.params.id}})
    await User.updateOne({_id:req.params.id},{$pull:{following:req.user._id}})
    return res.redirect(`/account/user/${req.user._id}`)
}))

module.exports = {root,newBlog,account}