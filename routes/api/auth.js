const express = require('express');
const router = express.Router();
const auth = require('../../middleware/signup')
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult } = require('express-validator'); 



// @route       GET api/auth
// @desc        Login Route
// @access      public

router.post('/',
[
    check('email','Email is Required').not().isEmpty(),
    check('password','Password is Required')
    .exists()
], 
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    // console.log(req.body);
    
    const {email,password} = req.body;

    try{
        let user = await User.findOne({email});
        
        // See if user exist 
        if (!user){
            return res.status(400).json({ errors: [{
                msg: 'Invalid Credentials'
            }]})
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.status(400).json({ errors: [{
                msg: 'Invalid Credentials'
            }]})
        }
        if (user.ban_status == 1){
            return res.status(400).json({ errors: [{
                msg: 'Your Account is blocked'
            }]})
        }
        
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


// @route       GET api/auth
// @desc        auth Route
// @access      public

router.get('/',auth, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    }
    catch(err){
        console.error(err.msg);
        res.status(500).send('Server Error');
    }
})


// @route       GET api/auth
// @desc        auth Route
// @access      public

router.get('/all', async (req,res)=>{
    try{
        const user = await User.find();
        res.json(user);

    }
    catch(err){
        console.error(err.msg);
        res.status(500).send('Server Error');
    }
})







module.exports = router;