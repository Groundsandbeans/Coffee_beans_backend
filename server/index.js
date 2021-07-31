require('dotenv').config()
const express = require('express')
const app = express()
const stripe = require('stripe')('sk_test_egiiH17xRt4QTerkgBqpwoqm');
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const methodOverride = require('method-override');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Coffee = require('../models/coffee-model');
const util = require('util')
app.use(methodOverride('_method'))
app.use(express.json())

app.use(cors())
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

///////////////////////////////////////////////////////////////////////////////
//Stripe payment route
app.post('/api/payment', (req, res) => {
  const {cart, token} = req.body
  console.log(`RESPONSE ${util.inspect(req.body, false, null)}`)
  console.log(`Product ${util.inspect(cart, false, null)}`)
  console.log(`TOKEN ${util.inspect(token, false, null)}`)
  // console.log(`PRICE ${cart.price}`)
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
      // description: `purchased: ${product.name}`,
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
// stroage path for uploaded photos
const storage = multer.memoryStorage()
const  filename = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false)
        }
      };
const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        filename : filename
      })

/// gets all coffees
app.get('/api/index',(req, res) =>{
      Coffee.find({})
      .then((coffees =>
        res.json(coffees)))
})  
// adding new coffee to db
app.post('/api/create-new-coffee', upload.single('image'), (req, res, next) => {
  let newCoffee = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      weight: req.body.weight,
      img: {
          data: req.file.buffer,
          contentType: req.file.mimetype
      }
  }
  Coffee.create(newCoffee)
  .then(coffee => {
      console.log(coffee)
      // res.redirect('/route for coffee landing page')
  })
  .catch(console.error);
});

app.get('/api/:id', (req, res, next) => {
  const id = req.params.id
  Coffee.findById(id)
  .then(coffee => res.json(coffee))
})

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`)
})