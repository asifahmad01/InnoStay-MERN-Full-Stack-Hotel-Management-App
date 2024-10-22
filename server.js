const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();


app.get('/', (req, res)=>{
  res.send('Hello There we are here');
})



const bodyParser = require('body-parser');
app.use(bodyParser.json()); //data hold on req.body

const PORT = process.env.PORT || 3000;

const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');


app.use('/menu', menuRoutes);
app.use('/person', personRoutes);



app.listen(PORT, () =>{
  console.log('port listening at 3000');
})


