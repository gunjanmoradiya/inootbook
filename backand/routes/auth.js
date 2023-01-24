const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//create user using :post "/api/auth/createuser". 
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'Password must be at least 5 characters ').isLength({ min: 5 }),
], async (req, res) => {
    //if there errors,return bad request and error message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email })
    try {
        if (user) {
            return res.status(500).json({ error: "sorry user already exists" })
        }
        //encrypt password
        const JWT_SECRET = 'Harryisagoodboy';
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        //create token using jsonwebtoken
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occurred");
    }


});

module.exports = router