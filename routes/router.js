const {Router} = require('express')
const controller = require('../controllers/controller')
const { requireAuth } = require('../middleware/middleware')
const router = Router()

const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');  // Save images in the 'public/images' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Add timestamp to avoid file name conflicts
    }
});

const upload = multer({ storage: storage });

router.get('/login', controller.get_login)
router.post('/login', controller.post_login)
router.get('/signup', controller.get_signup)
router.post('/signup', controller.post_signup)
router.get('/logout', controller.get_logout)
//because maybe the token maxage was finished
router.get('/all',requireAuth , controller.get_all)
router.post('/all', upload.array('photos', 3), controller.post_all);  // accept up to 3 images
router.get('/food',requireAuth, controller.get_food)
router.get('/embroidery',requireAuth, controller.get_embroidery)
router.get('/candles',requireAuth ,controller.get_candles)
router.delete('/:id', controller.delete_project)

module.exports = router