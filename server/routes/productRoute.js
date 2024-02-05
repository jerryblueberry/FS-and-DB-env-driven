const express = require("express");
const router = express.Router();
const {addProducts, getProducts, getSpecificProduct, getStock, updateProduct, patchProducts}  = require('../controller/productController');
const { verifyAuth,isAdmin } = require('../middleware/authentication');
// const multer = require('multer');
const { multipleUpload} = require('../middleware/uploadMiddleware')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "files/"); // Specify the desired destination folder
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + "-" + file.originalname);
//     },
//   });
  
//   const upload = multer({ storage: storage,limits:{files:5} });
  

// const upload = multer({ storage: storage });


router.post('/add',multipleUpload ,verifyAuth, isAdmin, addProducts);


router.get('/all',verifyAuth,getProducts);

router.put('/update/:productId',verifyAuth,isAdmin,updateProduct);
router.get('/stock',verifyAuth,isAdmin,getStock);
router.patch('/quantity-update/:productId',verifyAuth,isAdmin,patchProducts);
router.get('/:productId',verifyAuth,getSpecificProduct);


module.exports=router;
