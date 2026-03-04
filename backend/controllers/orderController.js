const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const { products, total, currency, shippingAddress, paymentMethod } = req.body;
  try {
    const order = new Order({ user: req.user.id, products, total, currency, shippingAddress, paymentMethod });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};