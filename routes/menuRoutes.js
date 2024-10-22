const express = require('express');
const router = express.Router();


const Menu = require('./../model/Menu');


router.post('/', async (req, res) => {
  try {
    const data = req.body
    const newMenu = new Menu(data);
    const response = await newMenu.save();

    console.log('Menu Data Save');
    res.status(200).json(response);

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Internal Server error' });

  }
})


router.get('/', async (req, res) => {
  try {
    const data = await Menu.find();
    console.log('Data Featched Sucessfully');
    res.status(200).json(data);

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });

  }
})

router.get('/:tasteType', async (req, res) => {
  try {
    const tasteType = req.params.tasteType;
    if (tasteType == 'spicy' || tasteType == 'sweet' || tasteType == 'sour') {
      const response = await Menu.find({ taste: tasteType });
      console.log('featched Sucessfully');
      res.status(200).json(response);

    } else {
      console.log('Errorr to featching');
      res.status(404).json({ error: 'error for featching' });
    }
  }
  catch (error) {
    console.log(error);
    res.status(5000).json({ error: 'Internal Server Error' });
  }
})

router.put('/:id', async (req, res) => {

  try {
    const menuId = req.params.id;
    const updatedMenuData = req.body;

    const response = await Menu.findByIdAndUpdate(menuId, updatedMenuData, {
      new: true,
      runValidators: true
    })

    if (!response) {
      return res.status(404).json({ error: 'Menu are not found' });
    }

    console.log('Data Updated Sucessfully');
    res.status(200).json(response);

  }
  catch (error) {
    console.log('Server Error');
    res.status(500).json({ error: 'Internal Server Error' });

  }

})

router.delete('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;
    const response = await Menu.findByIdAndDelete(menuId);

    if (!response) {
      console.log('Menu not Found');
      res.status(404).json({ error: 'menu not Found' });
    }

  }
  catch (error) {
    console.log('server Error');
    res.status(500).json({ error: 'Internal Server Error' });

  }
})

module.exports = router;