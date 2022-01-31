const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator'); 
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');



// @route       GET api/Signup
// @desc        Signup Route
// @access      public
function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }

function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
router.post('/',
[   // username
    check('username','Username is Required').not().isEmpty(),
    check('first_name','First Name is Required').not().isEmpty(),
    check('last_name','Last Name is Required').not().isEmpty(),
    check('email','Email is Required').not().isEmpty(),
    check('password','Please enter a password with 6 or more characters').isLength(
        {min: 6}
    ),
    check('gender','Gender is Required').not().isEmpty(),
    check('age','Age is Required').not().isEmpty(),
    check('cnic','CNIC is invalid, format 1234567890123').isLength(
        {min: 13}
    ),
    check('address','Address is Required').not().isEmpty()
    // gender
    // age
    // cnic
    // address

    
], 
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    // console.log(req.body);
    
    const {username,first_name,last_name,email,password,gender,age,cnic,address} = req.body;


    if (hasWhiteSpace(username) || containsSpecialChars(username)){
        return res.status(400).json({ errors: [{
            msg: 'Invalid Username, Username shouldnt have white spaces or special characters'
        }]})

    }
    if (hasWhiteSpace(first_name) || containsSpecialChars(first_name) || isNumeric(first_name)){
        return res.status(400).json({ errors: [{
            msg: 'First Name can only contain alphabets'
        }]})
    }
    if (hasWhiteSpace(last_name) || containsSpecialChars(last_name) || isNumeric(last_name)){
        return res.status(400).json({ errors: [{
            msg: 'Last Name can only contain alphabets'
        }]})
    }
    try{
        let user = await User.findOne({email});
        
        // See if user exist 
        if (user){
            return res.status(400).json({ errors: [{
                msg: 'Email already exists'
            }]})
        }
        
        user = await User.findOne({username});
        
        // See if user exist 
        if (user){
            return res.status(400).json({ errors: [{
                msg: 'Username already exists change your username'
            }]})
        }

        user = new User({
            username,
            first_name,
            last_name,
            email,
            password,gender,age,cnic,address,
            profile_url: username
        });
        
        // Encrypt Password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt);

        await user.save()
        
        // Return JsonWebToken
        const payload = {
            user: {
                id:user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token)=>{
                if (err) throw err;
                res.json({token})
            }
        );

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }

})

module.exports = router;