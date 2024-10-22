const express = require('express');
const router = express.Router();


const Person = require('./../model/person');
const { Message } = require('@mui/icons-material');

router.post('/', async (req, res)=>{
  try{
    const data = req.body
  
    const newPerson = new Person(data);
    const response = await newPerson.save();

    console.log('Data Save');
    res.status(200).json(response);

  }
  catch(err){

    console.log(err);
    res.status(500).json({error: 'Internal Servar Error'});
  }
})



router.get('/', async (req, res)=>{
  try{
    const featchDate = await Person.find();
    console.log('Data Featched');
    res.status(200).json(featchDate);
  }
  
  catch(err){

    console.log(err);
    res.status(500).json({error: 'Internal Servar Error'});

  }
})


router.get('/:workType', async(req, res)=>{
  try{
    const workType = req.params.workType;
    if(workType == 'Chef' || workType== 'manager' || workType == 'waiter'){
      const response = await Person.find({work: workType});
      console.log('Response Featched Sucessfully');
      res.status(200).json(response);
    }else{
      res.status(404).json({error: 'Invalid Work found'});
    }
  }
  catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})


router.put('/:id', async(req, res)=>{
  try{
    const personId = req.params.id;
    const updatedPersonData = req.body;

    const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
      new: true,
      runValidators: true
    });

    res.status(200).json(response);
    console.log('Data update sucessfully');


    if(!response){
      res.status(404).json({error: 'Person Not Found'});
    }
  }
  catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }

})


router.delete('/:id', async(req, res)=>{
  try{
    const personId = req.params.id;
    const response = await Person.findByIdAndDelete(personId);
    
    res.status(200).json({Message: 'Person Data Deleted'});
    console.log('Delete sucessfully');

    if(!response){
      res.status(404).json({error: 'Person Are not Found'});
    }

  }
  catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
  
})

module.exports = router;