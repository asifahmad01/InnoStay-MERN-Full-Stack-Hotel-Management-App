// function calculateCircleArea(radius){
//   return Math.PI * radius ** 2;

// }

// console.log(calculateCircleArea(2));
// console.log(calculateCircleArea(10));



// function perfromOperation(a, b, callback){
//   return callback(a, b);
// }

// function add(a, b){
//   return a+b;
// }

// function subtract(a, b){
//   return a-b;
// }

// function multiply(a, b){
//   return a*b;
// }

// function divide(a, b){
//   return a/b;
// }

// console.log(perfromOperation(10, 20, add));
// console.log(perfromOperation(10, 20, subtract));
// console.log(perfromOperation(10, 20, multiply));
// console.log(perfromOperation(10, 20, divide));

// var fs = require('fs');

// fs.readFile('genrate.txt', 'utf-8', (err, data)=>{
//   if(err){
//     console.log("Error reading file: ", err)
//     return;
//   }
//   console.log(data);
// });


// const os = require('os');

// console.log("total Memory:", os.totalmem);
// console.log("free memory : ", os.freemem);
// console.log("platfrom", os.platform);
// console.log("Number of CPU core :", os.cpus().length);


const _lodash = require('lodash');

function sumOfEvenNumbers(number) {
  const evenNumbers = _lodash.filter(number, num => num % 2 === 0);
  return _lodash.sumBy(evenNumbers);
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(sumOfEvenNumbers(numbers));
