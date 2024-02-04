const express = require("express");
const router = express.Router();
const {addProducts, getProducts, getSpecificProduct, getStock, updateProduct, patchProducts}  = require('../controller/productController');
const { verifyAuth,isAdmin } = require('../middleware/authentication');


router.post('/add', verifyAuth, isAdmin, addProducts);


router.get('/all',verifyAuth,getProducts);

router.put('/update/:productId',verifyAuth,isAdmin,updateProduct);
router.get('/stock',verifyAuth,isAdmin,getStock);
router.patch('/quantity-update/:productId',verifyAuth,isAdmin,patchProducts);
router.get('/:productId',verifyAuth,getSpecificProduct);


module.exports=router;
