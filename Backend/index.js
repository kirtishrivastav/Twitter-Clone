const express = require('express');
const dotenv = require('dotenv');
const ConnectDb= require('./DatabaseConnect');
const userRouter=require('./Routes/User.route.js');
const tweetRouter=require('./Routes/Tweet.route.js');
const authRouter= require('./Routes/Auth.route.js');
const bodyParser = require('body-parser');
const cors= require('cors')
const path = require('path');
dotenv.config();

const app = express();

app.use('../uploads', express.static(path.join(__dirname, '../uploads')));


const PORT = process.env.PORT ||8000; 
// body parser middleware
app.use(bodyParser.json());
app.use(cors(
    {
        origin:["http://localhost:5000","http://localhost:5173"]
    }
));



app.use('/API/user',userRouter)
app.use('/API/tweet',tweetRouter)
app.use('/API/auth',authRouter)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen (PORT, async(err) => {
    if (err) {
        
       await ConnectDb()
        console.error('Error starting server:', err);
    } else {
        
        console.log(`Server is running on port ${PORT}`);
    }
});
