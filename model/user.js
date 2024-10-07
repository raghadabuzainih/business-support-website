const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')
const {isAlphanumeric} = require('validator')

const userSc = new Schema({
    'email' : {
        type: String,
        required: [true, 'enter email'],
        lowercase: true,
        unique: true,
        validate: [isEmail, 'enter valid email']
    },
    'password' : {
        type: String,
        required: [true, 'enter password'],
        minlength: [6, 'minimum number of digits is 6']
    },
    'userName' : {
        type: String,
        required: true,
        minlength: [7, 'minimum length of letters is 7'],
        validate: [isAlphanumeric],
        unique: [true, 'enter unique name']
    },
    'phoneNumber' : {
        type: Number,
        unique: true
    }
}, {timestamps: true})

userSc.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSc.statics.login = async function(email, password){
    const User = await this.findOne({email})
    if(User){
        const auth = await bcrypt.compare(password, User.password)
        if(auth) return User
        throw Error('incorrect password')
    }throw Error('incorrect email')
}

const user = mongoose.model('user', userSc)
module.exports = user