const AppError = require('./AppError')

module.exports.asyncCatcher = (fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch((e)=>{
            console.log(e);
            next(new AppError('something went wrong','500'))
        })
    }
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return  next()
    }
    return res.redirect('/account/login')
}

module.exports.isLoggedInBTS = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }

    return res.json({re:'/account/login'})

}