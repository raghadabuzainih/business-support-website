const jwt = require('jsonwebtoken')
const user = require('../model/user')
const project = require('../model/project')
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')

function setID(id){
    localStorage.setItem('id', id)
}

function getID(){
    return localStorage.getItem('id')
}

const handleErrors = (err) => {
    const errors = {'email' : '', 'password' : '', 'userName' : '', 'phoneNumber' : ''}
    if(err.code == 11000){
        if(err.message.includes('email')) errors.email = 'user exists'
        else errors.userName = 'user exists'
        return errors
    }
    if(err.message.includes('incorrect email')){
        errors.email = 'user not exists'
    }
    if(err.message.includes('incorrect password')){
        errors.password = 'incorrect password'
    }
    if(err.message.includes('user validation failed:')){
        Object.values(err.errors).forEach(error=>{
            errors[error.properties.path] = error.properties.message
        })
    }
    return errors
}

const maxAge = 60*60
const createToken = (id) => {
    return jwt.sign({id}, 'raghad az', {
        expiresIn: maxAge
    })
}

const get_login = (req, res) => {
    res.render('login', {titleName: 'Login page'})
}

const post_login = async(req, res) => {
    try{
        const {email, password} = req.body
        const User = await user.login(email, password)
        setID(User._id)
        const token = createToken(User._id)
        res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true})
        res.status(200).json({user: User._id})
    }catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

const get_signup = (req, res) => {
    res.render('signup', {titleName: 'Signup page'})
}

const post_signup = async(req, res) => {
    try{
        const {email, password, userName,phoneNumber} = req.body
        const newUser = await user.create({email, password, userName, phoneNumber})
        setID(newUser._id)
        const token = createToken(newUser._id)
        res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true})
        res.status(200).json({user: newUser._id})
    }catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

const get_logout = (req, res) => {
    localStorage.removeItem('id')
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}

const get_all = async(req, res) => {
    const id = getID()
    if(id){
        const projects = await project.find({})
        .sort({createdAt: -1}).populate('userID')
        res.render('all', {titleName: 'All',
            header: 'All projects',
            projects,
            background: './images/all-cover.jpg'
        })
    }else{
        res.redirect('/')
    }
}

const get_food = async(req, res) => {
    const id = getID()
    if(id){
        const projects = await project.find({section: 'food'})
        .sort({createdAt: -1}).populate('userID')
        res.render('food', {titleName: 'Food',
            header: 'Food projects',
            projects,
            background: './images/food-cover.PNG'
        })
    }else{
        res.redirect('/')
    }
}

const get_embroidery = async(req, res) => {
    const id = getID()
    if(id){
        const projects = await project.find({section: 'embroidery'})
        .sort({createdAt: -1}).populate('userID')
        res.render('embroidery', {titleName: 'Embroidery',
            header: 'Embroidery projects',
            projects,
            background: './images/embroidery-cover.jpg'
        })
    }else{
        res.redirect('/')
    }
}

const get_candles = async(req, res) => {
    const id = getID()
    if(id){
        const projects = await project.find({section: 'candles'})
        .sort({createdAt: -1}).populate('userID')
        res.render('candles', {
            titleName: 'Candles',
            header: 'Candles projects',
            projects,
            background: './images/candle-cover.jpg'
        })
    }else{
        res.redirect('/')
    }
}

const post_all = async (req, res) => {
    try {
        const { title, section, description } = req.body;
        const userID = getID()
        const imagePaths = req.files.map(file => `/images/${file.filename}`);

        const newProject = await project.create({
            userID,
            title,
            section,
            description,
            images: imagePaths
        });

        res.status(200).json({ newProject });
    } catch (err) {
        console.error(err);
    }
};

const delete_project = async(req, res) => {
    const id = req.params.id
    await project.findByIdAndDelete(id)
}

module.exports = {
    get_login,
    post_login,
    get_signup,
    post_signup,
    get_logout,
    get_all,
    post_all,
    get_candles,
    get_food,
    get_embroidery,
    delete_project
}