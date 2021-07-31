require('dotenv').config()
const express = require('express')
const app = express()
const stripe = require('stripe')(process.env.API_KEY);
const cors = require('cors')
const methodOverride = require('method-override');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Coffee = require('../models/coffee-model');
//Frontend URL for Stripe redirects
// const YOUR_DOMAIN = 'http://localhost:3000'

app.use(methodOverride('_method'))
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log(req.body)
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd"
    })

    res.status(200).send(paymentIntent.client_secret)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
    }
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


//////////////////////////////////////////////////////////////////////////////////////////////
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       // TODO: replace this with the `price` of the product you want to sell
    //       price: '{{PRICE_ID}}',
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${YOUR_DOMAIN}/success.html`,
    //   cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    // });
    // res.redirect(303, session.url)

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`)
})