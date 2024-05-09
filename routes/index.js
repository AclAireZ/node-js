var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');
// const verfyToken = require('../middleware/jwt_decode');
const authorizationAdmin = require('../middleware/adminPass');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//login user
router.post('/login', async function (req, res, next) {
  try {
      let { password, username } = req.body;
      let user = await Users.findOne({ username: username });
      if (!user) {
          return res.status(500).send({
                status: 500,
                message: "Login failed. User not found.",
                success: false,
          });
      }

      if (!user.approved) {
          return res.status(400).send({
                status: 400,
                message: "Login failed. User is not approved by the admin yet.",
                success: false,
          });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
          return res.status(500).send({
              status: 500,
              message: "Login failed. Incorrect password.",
              success: false,
          });
      }

      // Generate JWT token
      const token = jwt.sign({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
      }, process.env.JWT_KEY);

      return res.status(200).send({
          data: {
             status: 200,
              _id: user._id,
            //   username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            //   email: user.email,
              role: user.role,
              token
          },
          message: "Login successful.",
          success: true,
      });

  } catch (error) {
      console.error(error);
      return res.status(500).send({
          status: 500,
          message: "An error occurred during login.",
          success: false,
      });
  }
});

router.put('/approve/:id',authorizationAdmin ,async function (req, res, next) {
    
  try {
      const userId = req.params.id;
      
      // Find the user by ID
      const user = await Users.findById(userId);
      if (!user) {
          return res.status(404).json({
              status: 404,
              message: "User not found.",
              success: false
          });
      }

      // Approve the user
      user.approved = true;
      await user.save();

      return res.status(200).json({
          status: 200,
          message: "User approved successfully.",
          success: true,
          user: user
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          status: 500,
          message: "An error occurred while approving the user.",
          success: false
      });
  }
});



module.exports = router;
