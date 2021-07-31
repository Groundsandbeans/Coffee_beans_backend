require('dotenv').config()
const express = require('express')
const app = express()
const stripe = require('stripe')('sk_test_egiiH17xRt4QTerkgBqpwoqm');
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const methodOverride = require('method-override');
const fs = require('fs');
const path = require('path');
const Coffee = require('../models/coffee-model');
app.use(methodOverride('_method'))
app.use(express.json())

app.use(cors())
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

// Have Node serve the files for our built Coffee-app
app.use(express.static(path.resolve(__dirname, '../server/build')));

///////////////////////////////////////////////////////////////////////////////
//Stripe payment route
app.post('/api/payment', (req, res) => {
  const {cart, token} = req.body
  const price = cart.reduce((a, b) => {
    return a + b.price}, 0)
  console.log(`FINAL PRICE ${price}`)
  const idempotencyKey = uuidv4()

  return stripe.customers.create({
    email: token.email,
    source: token.id
  })
  .then(customer => {
    stripe.charges.create({
      amount: price * 100,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      shipping: {
        name: token.card.name,
        address: {
          country: token.card.address_country
        }
      }
    }, {idempotencyKey})
  })
  .then(result => res.status(200).json(result))
  .catch(err => console.log(err))
})

///////////////////////////////////////////////////////////////////////////////
// test route from server to React app
app.get("/api", (req, res) => {
  res.json({ "message": "Hello from Deshawn and the may the Server be with you!" });
});

/// gets all coffees
app.get('/api/index',(req, res) =>{
      Coffee.find({})
      .then((coffees =>
        res.json(coffees)))
})  
// adding new coffee to db
app.post('/api/create-new-coffee', (req, res, next) => {
  //Turns prices and weights into array and removes commas and whitespace
  let prices = req.body.price.replace(/,/g,"")
  let priceArr = prices.split(' ')
  let weights = req.body.weight.replace(/,/g,"")
  let weightArr = weights.split(' ')

  // New Coffee object
  let newCoffee = {
      name: req.body.name,
      flavor: req.body.flavor,
      roast: req.body.roast,
      region: req.body.region,
      price: priceArr,
      weight: weightArr,
      img: req.body.img
  }
  console.log(newCoffee)
  Coffee.create(newCoffee)
  .then(coffee => res.send(`${coffee} added`))
  .catch(console.error);
});

//Show individual coffee
app.get('/api/:id', (req, res, next) => {
  const id = req.params.id
  Coffee.findById(id)
  .then(coffee => res.json(coffee))
})

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`)
})