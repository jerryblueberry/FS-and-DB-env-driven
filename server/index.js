const express = require('express');
const cors = require('cors');
const connectDb = require('./db/database');
const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoutes');
const cart  = require('./routes/cartRoute');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.json());
require('dotenv').config();


const PORT = process.env.PORT || 3000


app.use('/users',user);
app.use('/products',product);
app.use('/carts',cart);
app.use('/orders',order);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(PORT,() => {
    console.log(`Listening on Port ${PORT}`);

    connectDb();
});


