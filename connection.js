const mongoose = require('mongoose')

module.exports.mongoose = mongoose
module.exports.connectDB = async ()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/blogdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(d=>{
        console.log("MONGODB CONNECTED AND LISTENING AT PORT 27017...");
    })
}

