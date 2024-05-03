const express = require("express");
const { registerController, loginController } = require("../controllers/userControllers");
//routerobject
const router = express.Router();


//routes

router.post("/register", registerController)
//  Login
router.post("/login", loginController)
//export
module.exports = router;