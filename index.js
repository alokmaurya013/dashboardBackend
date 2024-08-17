const express=require('express');
const Connection= require('./database/db');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors')

const app=express();
const port=process.env.PORT;
dotenv.config();
app.use(express.json());
app.use(cors());
app.use('/api/auth',require('./routes/auth'));
app.use('/api/principal',require('./routes/principal'));
app.use('/api/teacher',require('./routes/teacher'));
app.use('/api/display',require('./routes/display'));
app.use('/api/edit',require('./routes/edit'));

Connection();

app.get('/',(req,res)=>{
   res.send('hello from nodejs');
});
app.listen(port,()=>{
    console.log(`backend is running on port:${port}`);
});

