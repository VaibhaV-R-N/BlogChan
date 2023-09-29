const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const multer = require('multer')

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET

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

