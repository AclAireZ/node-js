var express = require('express');
var router = express.Router();
const Order = require('../models/orders');
const Product = require('../models/products');
const mongoose = require('mongoose');

//get all orders
router.get("/", async function(req, res){
    try {
        let orders = await Order.find();
        return res.status(200).send({
            status: 200,
            data: orders,
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

//delete order
router.delete("/:id/cancelorder", async function(req, res){
    try {
        let orderId = req.params.id; 
        console.log(orderId);// Use a different variable name to avoid confusion
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({
                status: 400,
                message: "Invalid id",
                success: false,
                error: ["id is not a ObjectId"],
            });
        }

        // Find the order and delete it
        let deletedOrder = await Order.findOneAndDelete(orderId);
        
        if (!deletedOrder) {
            return res.status(404).send({
                status: 404,
                message: "Order not found",
                success: false,
            });
        }

        // Update amount of product
        let id = deletedOrder.productId;
        let product = await Product.findById(id);
        product.amount += deletedOrder.amount; 
        await product.save();

        // Fetch updated orders list
        let orders = await Order.find();

        return res.status(200).send({
            status: 200,
            data: orders,
            message: "success",
            success: true,
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).send({
            status: 500,
            message: "Server error",
            success: false,
        });
    }
});



//----------------------------------test add order--------------------------------

// router.post('/addorder', async (req, res) => {
//     try {
//         // Extract data from the request body
//         const { name, amount, productId } = req.body;

//         // Check if the product exists
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         if (product.amount === 0) {
//             return res.status(400).json({ error: 'Product is out of stock' });
//         }
//         // Create a new order
//         const newOrder = new Order({
//             name,
//             amount,
//             productId
//         });

//         // Save the order to the database
//         await newOrder.save();

//         // Push the order into the product's order array
//         await Product.findOneAndUpdate(
//             { _id: productId },
//             { $push: { order: newOrder._id } }
//         );

//         product.amount -= amount;
//         await product.save();

//         // Respond with success message
//         res.status(200).json({ 
//             data: newOrder,
//             message: 'Order added successfully' ,
//             success: true
//         });
//     } catch (error) {
//         // Handle errors
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

//-------------------------------------------test add order---------------------------------



module.exports = router;
