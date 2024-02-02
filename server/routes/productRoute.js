const express = require("express");
const router = express.Router();
const {addProducts, getProducts, getSpecificProduct, getStock, updateProduct, patchProducts}  = require('../controller/productController');



router.route('/add').post(addProducts);
router.route('/all').get(getProducts);
router.route('/update/:productId').put(updateProduct);
router.route('/stock').get(getStock);
router.route('/quantity-update/:productId').patch(patchProducts);
router.route('/:productId').get(getSpecificProduct);


module.exports=router;