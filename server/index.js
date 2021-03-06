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
// Twilio Account SID and Auth Token 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
app.use(methodOverride('_method'))
app.use(express.json())
const util = require('util');
const ShoppingCart = require('../models/shopping-cart');
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

  const {cart, token, order} = req.body
  console.log(`ORDER ${order}`)
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

//Delete individual coffee
app.delete('/api/delete/:id', (req, res, next) => {
  const id = req.params.id
  Coffee.findOneAndDelete({_id: id})
  .then(coffee => res.json(coffee))
})

//Edit individual coffee
app.put('/api/edit/:id', (req, res, next) => {
  const id = req.params.id

  let prices = req.body.price.replace(/,/g," ")
  let priceArr = prices.split(' ')
  let weights = req.body.weight.replace(/,/g," ")
  let weightArr = weights.split(' ')

  Coffee.findByIdAndUpdate(id, {
    name: req.body.name,
    flavor: req.body.flavor,
    roast: req.body.roast,
    region: req.body.region,
    price: priceArr,
    weight: weightArr,
    img: req.body.img
  },
  { new: true }
  )
  .then(coffee => res.json(coffee))
  

})

///////////////////////////////////////////////////////////////////////////////
//Get shoppingCart items
app.get('/api/cart/:id', (req, res) => {
  ShoppingCart.find({email: req.params.id})
  .then(coffees => res.json(coffees))
})


// Add coffee to ShoppingCart
app.post("/api/cart/:id", (req, res) => {
  console.log(req.body)
  console.log(req.body.price)
  console.log(req.body.weight)
  // find email for current shopping cart user // push the coffee id to that users shoping cart
  ShoppingCart.findOneAndUpdate({email: req.body.email}, 
    { $push : 
      {coffee: 
        {coffee_id: req.body.coffee, 
        price: req.body.price, 
        weight: req.body.weight}} }, 
      {new: true,
    upsert: true})
  .then((user  => console.log(user)))
});

app.post('/api/cart/:id', (req, res) => {
  
  ShoppingCart.findOneAndUpdate({email: req.body.email}, {
    new: true,
    upsert: true
  }, { $push: {coffee_id: req.body.coffee} })
  .then(coffee => console.log(coffee))


  console.log(req.body.coffee)
  console.log(req.body.email)
})

// Remove coffee from ShoppingCart
app.delete('/api/cart/:id', (req, res) => {
  console.log(req.body.email)
  console.log(req.body.remove)
  ShoppingCart.findOneAndUpdate({email: req.body.email}, 
    {$pull: {coffee: {coffee_id: req.body.remove}}})
  .then(coffee => res.json(coffee))
})

// Remove users shoppingCart
app.delete('/api/cartDelete/:email', (req, res) => {
  ShoppingCart.findOneAndDelete({email: req.params.email})
  .then(coffee => res.json(coffee))
})


//Receipt Route
app.post('/thanks', (req, res) => {
  client.messages
  .create({
     body: `Thank you for your purchase at CoffeeBean of $${req.body.totalPrice}, your Coffee is beening shipped espresso!` ,
     from: '+18727136450',
     to: `+1${req.body.phoneNumber}`
   })
})

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log(`??? PORT: ${app.get('port')} ????`)
})