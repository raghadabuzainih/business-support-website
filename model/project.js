const mongoose = require('mongoose')
const { isAlpha } = require('validator')
const Schema = mongoose.Schema

const user = require('./user')

const porjectSc = new Schema({
    'userID' :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    'title': {
        type: String,
    },
    'section' : {
        type: String,
    },
    'description' : {
        type: String,
    },
    'images' : {
        type: Array
    }
}, {timestamps: true})

const project = mongoose.model('project', porjectSc)
module.exports = project