const jwt = require('jsonwebtoken')
const user = require('../model/user')

const requireAuth = async(req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'raghad az', async(err, decodedtoken)=> {
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

const checkUser = async(req, res, next) => {
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'raghad az', async(err, decodedtoken)=> {
            if(err){
                res.locals.user = null
                next()
            }else{
                const User = await user.findById(decodedtoken.id)
                res.locals.user = User
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}

module.exports = {requireAuth, checkUser}