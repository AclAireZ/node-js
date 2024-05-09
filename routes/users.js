var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/userModel');
// const jwt = require('jsonwebtoken');

router.post("/", async function(req, res, next) {
  try {
    let { password, username, firstName, lastName, email, role} = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      username,
      password: hashPassword,
      firstName,
      lastName,
      email,
      role: 'user',
    });
    const user = await newUser.save();
    
    return res.status(200).send({
      status: 200,
      data: {
        _id: user._id,
        username,
        firstName,
        lastName,
        email,
        role
        
      },
      message: "User created successfully",
      success: true,

    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send({
      status: 500,
      message: "u already has a user",
      success: false,
    });
  }
});


router.post("/admin", async function(req, res, next) {
  try {
    let { password, username, firstName, lastName, email, role } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      username,
      password: hashPassword,
      firstName,
      lastName,
      email,
      role: 'admin',
    });
    const user = await newUser.save();
    
    return res.status(200).send({
      status: 200,
      data: {
        _id: user._id,
        username,
        firstName,
        lastName,
        email,
        role
      },
      message: "User created successfully",
      success: true,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send({
      status: 500,
      message: "u already has a user",
      success: false,
    });
  }
});
// router.get('/', async function (req, res,next) {
//   try {
//     let users = await Users.find();
//     return res.status(200).send({
//       data: users,
//       message: "success",
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).send({
//       message: "fail",
//       success: false,
//     });
//   }
// });






module.exports = router;
