const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const multer = require('multer')



cloudinary.config({
    cloud_name:'dac8cfkxj',
    api_key:'428634335614198',
    api_secret:'90u76cLMASUcFGJKidsjD-uaofU'

})


const storage =  new CloudinaryStorage({

    cloudinary:cloudinary,
    params:{
        resource_type:'auto',
        folder:'blogdb',
        allowedFormats:['jpg','png','jpeg','JPEG','PNG','JPG','mp3','mp4']
    }

})


const upload = multer({storage:storage})

module.exports = {upload,cloudinary}

