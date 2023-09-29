const {mongoose,connectDB} = require('./connection')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')
connectDB().catch(e=>{
    console.log('MONGODB COONECTION FALIED...');
})


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

    },
    upvote:{
        type:Number,
        default:0
    },
    downvote:{
        type:Number,
        default:0
    }

})

const UserSchema = new Schema({
    followers:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    date:{
        type:String,

    }
})
UserSchema.plugin(passportLocalMongoose)

const CommentSchema = new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    blog:{
        type:Schema.Types.ObjectId,
        ref:'Blog'
    },
    comment:{
        type:String
    },
    date:{
        type:String,

    }
})

const VoteSchema = new Schema({
    blog:{
        type:Schema.Types.ObjectId,
        ref:'Blog'
    },
    upvote:[{
            type:Schema.Types.ObjectId,
            ref:'User'}],
            
    downvote:[{
            type:Schema.Types.ObjectId,
            ref:'User'}]
    
})





module.exports.Blog = mongoose.model('Blog',BlogSchema)
module.exports.User = mongoose.model('User',UserSchema)
module.exports.Vote = mongoose.model('Vote',VoteSchema)
module.exports.Comment = mongoose.model('Comment',CommentSchema)

