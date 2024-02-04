const express = require('express');
const {signUpUser, signInUser, patchUser} = require('../controller/userController');
const {verifyAuth} = require('../middleware/authentication');


const router = express.Router();


router.post('/signup',signUpUser)
router.post('/login',signInUser);
router.patch('/update/:userId',verifyAuth,patchUser);
module.exports = router;