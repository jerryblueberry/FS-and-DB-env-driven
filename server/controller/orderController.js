const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const storeTo = process.env.STORE_TO;
// declare the file path for the orders
const filePath = path.join(__dirname, '../data/orders.json');

//  filepath for the cart
const filePathCart = path.join(__dirname, '../data/carts.json');

//  generate random id for the orders

const generateRandomId = () => Math.floor(Math.random() * 1000000);

//  function to read orders from the file
const readOrdersFromFile = async () => {
  try {
    const OrderData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(OrderData);
  } catch (error) {
    return [];
  }
};

// function to write(create) the orders
const writeOrderToFile = async (orders) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    return 'Error Occurred';
  }
};

// Function to read the cart data
const readCartsFromFile = async () => {
  try {
    const cartData = await fs.readFile(filePathCart, 'utf-8');
    return JSON.parse(cartData);
  } catch (error) {
    console.log('Error occurred while reading file', error);
    return [];
  }
};
// Function to write the cart data
const writeCartsToFile = async (carts) => {
  try {
    await fs.writeFile(filePathCart, JSON.stringify(carts, null, 2), 'utf8');
  } catch (error) {
    return 'Error Occurred';
  }
};

// endpoint for creating orders
const orderProduct = asyncHandler(async (req, res) => {
  try {
    if (storeTo === 'FS') {
      const { userId } = req.body;

      const carts = await readCartsFromFile();

      const index = carts.findIndex((cart) => cart.userId === userId);

      if (index === -1) {
        return res.status(404).json({ message: 'No cart Found' });
      }

      // console.log(carts[index]);
      const orderId = generateRandomId();
      //  for the treshold of minimum total price of the cart before checkout
      if (carts[index].total_price < 100) {
        return res
          .status(401)
          .json({ message: 'Cart Total price must be above 100' });
      } else {
        const order = {
          id: orderId,
          userId,
          products: carts[index].products,
          total_price: carts[index].total_price,
        };
        const orders = await readOrdersFromFile();
        orders.push(order);

        await writeOrderToFile(orders);
        // it removes the data from the cart after checkout
        carts.splice(index, 1);
        await writeCartsToFile(carts);

        res.status(200).json(order);
      }
    } else if (storeTo === 'DB') {
      const { userId, products, total_price } = req.body;

      // Validate input data
      if (!userId || !products || !total_price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create a new purchase
      const newOrder = new Order({
        userId,
        products,
        total_price,
      });

      // Save the purchase to the database
      const savedPurchase = await newOrder.save();

      // Remove products from the user's cart and make it completely empty
      try {
        const userCart = await Cart.findOne({ userId });

        if (userCart) {
          // Set the products array to an empty array
          userCart.products = [];

          // Set total_price to 0 (optional, depending on your requirements)
          userCart.total_price = 0;

          // Save the updated user's cart
          await userCart.save();
        } else {
          return res.status(404).json({ error: "User's cart not found" });
        }
      } catch (error) {
        console.error('Error updating user cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Respond with the saved purchase
      res.status(201).json(savedPurchase);
    } else {
      return res.status(500).json({ error: 'Invalid Storage Configuration' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOrders = asyncHandler(async (req, res) => {
  try {
    if (storeTo === 'FS') {
      const userId = parseInt(req.params.userId);
      const orders = await readOrdersFromFile();

      const userOrders = orders.filter((order) => order.userId === userId);

      if (userOrders.length === 0) {
        return res
          .status(404)
          .json({ message: 'Orders for the user not found!' });
      }

      res.status(200).json(userOrders);
    } else if (storeTo === 'DB') {
      const userId = req.params.userId;

      // Validate the userId
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }

      const purchases = await Order.find({ userId }).populate(
        'products.product'
      ); // Populate product details
      res.status(200).json(purchases);
    } else {
      return res.status(500).json({ erorr: 'Invalid Storage Configuration' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { orderProduct, getOrders };
