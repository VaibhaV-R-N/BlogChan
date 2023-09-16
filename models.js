const {mongoose,connectDB} = require('./connection')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')
connectDB().catch(e=>{
    console.log('MONGODB COONECTION FALIED...');
})

const currentDate  = new Date()

const getDate = ()=>{
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()+1
    const date = currentDate.getDate()
    return `${date}/${month}/${year}`
}

const BlogSchema = new Schema({

    user:{
        type:Schema.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    textList:[{
        type:String,
        required:true
    }],
    textStyleList:[{
        type:String,
        required:true
    }],
    fileIndExt:[{
        type:String,
    }],
    files:[{
        path:String,
        filename:String
    }],
    date:{
        type:String,
        default:getDate()
    }

})

const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    }
})

UserSchema.plugin(passportLocalMongoose)


module.exports.Blog = mongoose.model('Blog',BlogSchema)
module.exports.User = mongoose.model('User',UserSchema)


