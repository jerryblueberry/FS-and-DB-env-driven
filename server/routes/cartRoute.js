const express= require('express');
const router = express.Router();

const {addCart, getCart, cartIncreament, cartDecreament, removeProduct} = require('../controller/cartController');

router.route('/add-cart').post(addCart);
router.route('/increament/:userId').put(cartIncreament)
router.route('/decreament/:userId').put(cartDecreament)
router.route('/remove/:userId').delete(removeProduct)
router.route('/user-cart/:userId').get(getCart)

module.exports = router;
