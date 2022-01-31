const express = require('express');
const router = express.Router();
const auth = require('../../middleware/signup')
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult } = require('express-validator'); 
var nodemailer = require('nodemailer');


// @route       GET api/auth
// @desc        Forget Password Route
// @access      public

router.post('/',
[
    check('email','Email is Required').not().isEmpty()
    
], 
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    // console.log(req.body);
    
    const {email} = req.body;

    try{
        let user = await User.findOne({email});
        
        // See if user exist 
        if (!user){
            return res.status(400).json({ errors: [{
                msg: "Email Doesn\' Exist"
            }]})
        }
        
        var transporter = nodemailer.createTransport({
            port: 465,               
            host: "smtp.gmail.com",
            auth: {
              user: 'legendbest123@gmail.com',
              pass: 'lhirkpglxdjptzhx'
            },
            secure: true,
          });
        
        var mailOptions = {
            from: 'legendbest123@gmail.com',
            to: user.email,
            subject: 'Request for password recovery',
            text: 'this is your password\n Password: Bhutto Yaad Aya ?'
        };
        const payload = {
            user: {
                id:user.id
            }
        }
        let TokenForForgetPassword;
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token)=>{
                if (err) throw err;
                var mailOptions = {
                    from: 'legendbest123@gmail.com',
                    to: user.email,
                    subject: 'Request for password recovery',
                    text: `Click Here to Reset Password:  http://localhost:5000/${token}`
                };
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.json({status: "400"})
                    } else {
                        res.json({status: "200"})
                    }
                });
                // res.json({token})
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

module.exports = router;