const mongoose= require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ConnectDb= async()=>{
  mongoose.connect(process.env.Connect_String);
  console.log('database connected')
}
ConnectDb();

module.exports= ConnectDb;