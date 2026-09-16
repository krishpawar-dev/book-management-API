var express = require('express');
var router = express.Router();
const authMiddleware = require('../Middleware/auth');

const {
  RegisterUser,
  LoginUser,
  GetUser,
} = require('../controllers/user')
/* GET users listing. */

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/', authMiddleware, GetUser)

module.exports = router;
