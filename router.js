const express = require('express')

const multer = require('multer')
const upload = multer({dest:'files/'})
const root = express.Router()
const newBlog = express.Router()

root.get('/',(req,res,next)=>{
    res.send('<h1>yup</h1>')
})

newBlog.get('/',(req,res,next)=>{
    res.render('newblog',{title:'New'})
    })
    .post('/',upload.single('file'),(req,res,next)=>{
        console.log(req.body);
        res.json({'re':'/'})
    })


module.exports = {root,newBlog}