
const { stubString } = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const { Save } = require('@mui/icons-material');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ['Chef', 'waiter', 'manager'],
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    type: String,
  },
  salary: {
    type: Number
  },
  username: {
    required: true,
    type: String

  },
  password: {
    required: true,
    type: String
  }
})

personSchema.pre('save', async function(next){
  const person = this;

  //hash the password only if it has been modified (or is new)
  if(!person.isModified('password')) return next();

  try{
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    //Override the plain password with the hashed one
    person.password = hashedPassword;

    next();
  }
  catch(error){

    return next(error);
  }
})

personSchema.methods.comparePassword = async function(candidatePassword){
  try{
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;

  }
  catch(error){
    throw error;
  }
}

const Person = mongoose.model('Person', personSchema, 'staff');

module.exports = Person;