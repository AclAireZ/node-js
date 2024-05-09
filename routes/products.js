var express = require('express');
var router = express.Router();
const productModel = require('../models/products');
const mongoose = require('mongoose');
const Order = require('../models/orders');


//config upload
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });



/* GET all products. */
router.get("/", async function(req, res, next){
    try {
        let products = await productModel.find();
        return res.status(200).send({
            status: 200,
            data: products,
            message: "success",
            success: true,
        });
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: "server error",
            success: false,
        });
    }
});

//get products by id
router.get("/:id", async function(req, res, next){
    try {
        let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send({
                status: 400,
                message: "invalid id",
                success: false,
                
            });
        }
        let products = await productModel.findById(id).populate('order');
        return res.status(200).send({
            status: 200,
            data: products,
            message: "success",
            success: true,
        });
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: "server error",
            success: false,
        });
    }
});

//get products by id
router.post("/", async function(req, res, next){
    //if u want to upload use this code -->router.post("/",upload.single('nameImage'), async function(req, res, next)
    try{
    
        const { product_name, price, amount} = req.body;
        let newProduct = new productModel({
            product_name: product_name,
            price: price,
            amount: amount,
            // nameImage: nameImage = req.file.filename
        });
        let product = await newProduct.save();
        return res.status(200).send({
            status: 200,
            data: product,
            message: "Product created successfully",
            success: true,
        });
    }catch(err) {
        return res.status(500).send({
            status: 500,
            message: err.message,
            success: false,
        });
    }
});

//edit product
router.put("/:id", async function(req, res, next){
    try{
        let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                status: 400,
                message: "Invalid id",
                success: false,
            });
        }

        let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).send({
                message: "Product not found",
                success: false,
            });
        }

        return res.status(200).send({
            status: 200,
            data: updatedProduct,
            message: "Product updated successfully",
            success: true,
        });
    } catch(err){    
        return res.status(500).send({
            status: 500,
            message: err.message,
            success: false,
        });
    }
});



//delete product
router.delete("/:id", async function(req, res, next){
    try{
        let id = req.params.id;
        console.log(id);
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                status: 400,
                message: "Invalid id",
                success: false,
                error: ["id is not a ObjectId"],
            });
        }

        await productModel.deleteOne({_id: id, orderId: req.params.order});
        let products = await productModel.find();
        return res.status(200).send({
            data: products,
            status: 200,
            message: "Product deleted successfully",
            success: true,
        });
        
    } catch(err){
        return res.status(500).send({
            status: 500,
            message: "delete failed",
            success: false,
        });
    }
    
});


//-------------------add order----------------------
router.post('/:id/orders', async (req, res) => {
    try {
        // Extract data from the request body
        const { name, amount } = req.body;

        // request id's product
        const productId = req.params.id;
        console.log(productId);

        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.amount === 0 || product.amount < amount) {
            return res.status(400).json({ error: 'Product is out of stock' });
        }

        // Create a new order
        const newOrder = new Order({
            name,
            amount,
            productId
        });

        // Save the order to the database
        await newOrder.save();

        // Update product to include the order ID in its 'order' array
        product.order.push(newOrder._id);
        product.amount -= amount;
        await product.save();

        // Respond with success message
        res.status(200).json({ 
            status: 200,
            data: newOrder,
            message: 'Order added successfully' ,
            success: true
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ 
            status: 500,
            error: 'Internal server error' });
    }
});


//-----------------get all order's product
router.get("/:id/orders", async function(req, res, next){
    try {
        let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send({
                status: 400,
                message: "invalid id",
                success: false,
                error: ["id is not a ObjectId"],
            });
        }
        let products = await productModel.findById(id).populate('order');
        return res.status(200).send({
            status: 200,
            product: products.product_name,
            order: products.order,
            message: "success",
            success: true,
        });
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: "server error",
            success: false,
        });
    }
});





module.exports = router;