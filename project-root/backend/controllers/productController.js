const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, category, images, stock } = req.body;
  try {
    const product = new Product({ 
      name, 
      description, 
      price, 
      category, 
      images, 
      stock, 
      seller: req.user.id 
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
