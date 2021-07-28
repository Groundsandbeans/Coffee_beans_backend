const coffeeData = require('./coffee-seedData.json')
const Coffee = require('../models/coffee-model')

// Remove any preexisting data
Coffee.deleteMany({})
  .then(() => {
    // Insert the dummy data and return it
    // so we can log it in the next .then
    return Coffee.insertMany(coffeeData);
  })
  // If the insert was successful, we'll see the
  // results in the terminal
  .then(console.log)
  // Log the error if the insert didn't work
  .catch(console.error)
  // Whether it was successful or not, we need to 
  // exit the database.
  .finally(() => {
    // Close the connection to Mongo
    process.exit();
  });