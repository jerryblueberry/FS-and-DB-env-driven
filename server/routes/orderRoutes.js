const express = require('express');
const { orderProduct, getOrders } = require('../controller/orderController');
 const router  = express.Router();



 router.route('/').post(orderProduct);
 router.route('/:userId').get(getOrders);


 module.exports  = router;