const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


module.exports.mongoose = mongoose

module.exports.connectDB = async ()=>{
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(d=>{
        console.log("MONGODB CONNECTED AND LISTENING AT PORT 27017...");
    })
}

