const express = require('express');
const {signUpUser, signInUser, patchUser} = require('../controller/userController');



const router = express.Router();

router.route('/signup').post(signUpUser)
router.route('/login').post(signInUser);
router.route('/update/:userId').patch(patchUser);
module.exports = router;