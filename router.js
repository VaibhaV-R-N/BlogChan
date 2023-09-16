const express = require('express')
const passport = require('passport')
const {upload,cloudinary} = require('./cloudinary')
const {User,Blog} = require('./models')

const {asyncCatcher} = require('./middlewares')

const root = express.Router()
const newBlog = express.Router()
const account = express.Router()
 


root.get('/',(req,res,next)=>{
    res.render('home',{title:'Blog-Chan'})
})
.get('/blogs',async(req,res,next)=>{
    const blogs = await Blog.find()
    res.render('allblogs',{title:'blogs',blogs})
})
.get('/blogs/:id',async(req,res,next)=>{
    const id = req.params.id
    const blog = await Blog.findById(id).populate('user')
    // console.log(blog);
    res.render('blogpage',{title:blog.title,blog})
})

newBlog.get('/',(req,res,next)=>{
    res.render('newblog',{title:'New'})
    })
    .post('/',upload.array('files[]'),asyncCatcher(async(req,res,next)=>{
        let blog = new Blog({
            user:req.user._id,
            title:req.body.title,
            textList:req.body.textList,
            textStyleList:req.body.textStyleList,
            fileIndExt:req.body.fileIndExt
        })
        
        if(req.files){
            const files = []
            for(let file of req.files){
                files.push({path:file.path,filename:file.filename})
            }
            blog.files = files
        }
            
        blog = await blog.save()
        res.json({'re':'/'})
            
        } 
    ))

account.get('/signup',(req,res,next)=>{
    res.render('signup',{title:'SignUp'})
})
.get('/login',(req,res,next)=>{
    res.render('login',{title:'Login'})
})
.get('/logout',(req,res,next)=>{
    req.logOut((e)=>{
        if(e) return res.redirect('/')
        return res.redirect('/account/login')
    })
})
.post('/signup',async (req,res,next)=>{
    const formData = req.body.user
    const newUser = new User({email:formData.email,username:formData.username})
    const user = await User.register(newUser,formData.password)
    req.login(user,async (err)=>{
        if(err) return res.redirect('/account/signup')
        return res.redirect('/newblog')
    })
})
.post('/login',passport.authenticate('local',{successRedirect:'/newblog',failureRedirect:'/account/signup'}))

module.exports = {root,newBlog,account}