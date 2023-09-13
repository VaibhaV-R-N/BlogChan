const express = require('express')
const bodyParser = require('body-parser')

const path = require('path')
const {root,newBlog} = require('./router')

const app = express()
app.use(bodyParser.urlencoded({extended:false}))

// app.use(express.json())
app.use('/public',express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


app.listen(3000,()=>{
    console.log('LISTENING AT PORT:3000...');
})


app.use('/',root)
app.use('/newblog',newBlog)