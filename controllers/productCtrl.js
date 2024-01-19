const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')



const createProduct = asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    }
    catch(err){
        throw new Error(err);
    }

}) 

const getProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
    const product = await Product.findById(id);
    res.json(product);
    }
    catch(err){ throw new Error(err); }
})

const getAllProducts = asyncHandler(async(req,res)=>{
    try{
    const { page, sort, limit, fields, ...queryObj } = req.query;


    //sorting
    let sortObj={}
    if(sort){
        const sortedBy = sort.split(',');
    sortedBy.map(e => {
        e.startsWith('-') ? sortObj[e.substring(1)] = -1: sortObj[e] = 1
    })
    }

    //pagination
    const skip = Math.abs((page-1)*limit)
    if(page){
        const products = await Product.countDocuments();
        if(skip>=products) throw new Error("this page does not exist"); 
    }
    
    
    const products = await Product.find(queryObj).sort(sortObj).skip(skip);
    res.json(products);
    }
    catch(err){ throw new Error(err); }
})

const updateProduct = asyncHandler(async(req,res)=>{
    try{
    req.body.slug = slugify(req.body.title);
    const updateProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
    })
    res.json(updateProduct)
    }
    catch(err){ throw new Error(err); }
});

const deleteProduct = asyncHandler(async(req,res)=>{
    try{
    await Product.findByIdAndDelete(req.params.id)
    res.json({success: "Product deleted"})
    }
    catch(err){ throw new Error(err); }
});





module.exports = {createProduct,deleteProduct,getProduct,getAllProducts,updateProduct}