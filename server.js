const express = require('express');
const connectDB = require("./config/db");
const app = express();
let cors = require('cors');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(express.json());
app.use(cors());
connectDB();

  
// Init Middleware
app.use(express.json({extended:false}));

app.get('/',(req,res)=> res.send("API Running"))

app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/signup',require('./routes/api/signup'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running at port ${PORT}`))