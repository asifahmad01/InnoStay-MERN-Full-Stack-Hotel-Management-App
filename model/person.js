
const { stubString } = require('lodash');
const mongoose = require('mongoose');

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
  }
})

const Person = mongoose.model('Person', personSchema, 'staff');

module.exports = Person;