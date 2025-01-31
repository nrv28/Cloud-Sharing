const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const configdB = require('./config/db');
const authentication = require('./routes/authentication');
const deletefiles = require('./routes/deletefiles');
const getfiles = require('./routes/getfiles');
const uploadfiles = require('./routes/upload');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

configdB();
//----------------------------------------------------------------------
app.use('/',authentication);
app.use('/',uploadfiles);
app.use('/',getfiles);
app.use('/',deletefiles);
//----------------------------------------------------------------------
app.get('/',(req,res)=>{
   res.send("Working Perfectly");
});
//----------------------------------------------------------------------
app.listen(5000, () => console.log("Server running on port 5000"));
