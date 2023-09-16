const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')
const {User} = require('./models')
const path = require('path')

const {root,newBlog, account} = require('./router')

const app = express()
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))


app.use('/public',express.static(path.join(__dirname,'public')))

app.use(session({
    secret:'vaibhav',
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.user = req.user? req.user : undefined
    next()
})


app.listen(3000,()=>{
    console.log('LISTENING AT PORT:3000...');
})


app.use('/',root)
app.use('/newblog',newBlog)
app.use('/account',account)
