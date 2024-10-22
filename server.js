const express = require('express');
const app = express();
const db = require('./db');


app.get('/', (req, res)=>{
  res.send('Hello There we are here');
})


const bodyParser = require('body-parser');
app.use(bodyParser.json()); //data hold on req.body


const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');


app.use('/menu', menuRoutes);
app.use('/person', personRoutes);


app.listen(3000, () =>{
  console.log('port listening at 3000');
})


