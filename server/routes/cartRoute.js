const express= require('express');
const router = express.Router();

const {addCart, getCart, cartIncreament, cartDecreament, removeProduct} = require('../controller/cartController');
const { verifyAuth } = require('../middleware/authentication');

router.post('/add-cart',verifyAuth,addCart);
router.put('/increament/:userId',verifyAuth,cartIncreament);
router.put('/decreament/:userId',verifyAuth,cartDecreament)
router.delete('/remove/:userId',verifyAuth,removeProduct)
router.get('/user-cart/:userId',verifyAuth,getCart)

module.exports = router;
