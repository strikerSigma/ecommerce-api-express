const express = require('express');
const {createProduct, getProduct, getAllProducts, updateProduct, deleteProduct}  = require('../controllers/productCtrl')
const productRouter = express.Router();
const {isAdmin, authMiddleware} = require('../middleware/authMiddleware');

productRouter.post('/',authMiddleware,isAdmin,createProduct);
productRouter.get('/:id',getProduct);
productRouter.put('/:id',authMiddleware,isAdmin,updateProduct);
productRouter.delete('/:id',authMiddleware,isAdmin,deleteProduct);
productRouter.get('/',getAllProducts);

module.exports = productRouter;