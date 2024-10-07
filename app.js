const mongoose = require('mongoose')
const express = require('express')
const router = require('./routes/router')
const cookieParser = require('cookie-parser')
const app = express()
const {requireAuth, checkUser} = require('./middleware/middleware')

//middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.set('view engine', 'ejs')

const dbURI = 'mongodb+srv://[username]:password@cluster0.5j4sjdd.mongodb.net/[mongodb-name]?retryWrites=true&w=majority';
mongoose.connect(dbURI, {serverSelectionTimeoutMS: 5000})
.then(result => app.listen(3000))
.catch(error => console.log(error))

app.get('*', checkUser)
app.get('/', (req, res) =>{
     if(!req.cookies.jwt){
        res.render('home', {titleName: 'Home page'})
     }else{
        requireAuth
        res.render('allowed-page', {titleName: 'Allowed page'})
     }
})

app.use(router)