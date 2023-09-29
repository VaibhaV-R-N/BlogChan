const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')
const {User} = require('./models')
const path = require('path')
const MongoStore  = require('connect-mongo')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
  }
const {root,newBlog, account} = require('./router')

const app = express()
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))


app.use('/public',express.static(path.join(__dirname,'public')))

const store = new MongoStore({
    mongoUrl:process.env.DB_URL,
    secret:process.env.STORE_SECRET,
    touchAfter: 24 * 60 * 60
})


app.use(session({
    store,
    secret:process.env.SESSION_SECRETS,
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


app.listen(process.env.PORT,()=>{
    console.log('LISTENING AT PORT:3000...');
})


app.use('/',root)
app.use('/newblog',newBlog)
app.use('/account',account)

app.use((err,req,res,next)=>{
    const {message='something went wrong',status='500'} = err
    req.session.message = message
    req.session.status = status

    res.redirect(req.originalUrl)
})
