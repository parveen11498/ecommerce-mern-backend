const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
require('dotenv').config();
const stripe = require('stripe')("sk_test_51LnjBrSEqOMeYA8S9Xn107pYq7DMFUOibIfcX7xP159Te08AK7Pi9aF2DXZWymSWZQDLQ3nTSYRHFWDipoIWg1vq00SB2dE5lm");
require('./connection')

const server = require('http').createServer(app);
const io = require('socket.io')
(server, {
  cors: {
    origins: '*',
    methods: ['GET', 'POST', 'PATCH', "DELETE"]
  }
})

const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);

app.get('/', (req, res)=>{
  res.send('APP IS RUNNING')
});

app.post('/create-payment', async(req, res)=> {
  const {amount} = req.body;
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'INR',
      payment_method_types: ['card']
    });
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
   }
})

const port = process.env.PORT ||8080;
server.listen(port, () =>
  console.log(`Your server is running on port ${port}`)
);
app.set('socketio', io);