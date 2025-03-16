const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {

    try {
        const { productId } = req.body;
        const userId = req.user.id; 
    
        if (!productId) {
          return res.status(400).json({ success: false, message: "Product ID is required." });
        }
    

        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found." });
        }
    
        let cart = await Cart.findOne({ userId });
    
        if (cart) {

          const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
          );
    
          if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += 1;
          } else {
            cart.items.push({ productId, quantity: 1 });
          }
        } else {
          cart = new Cart({
            userId,
            items: [{ productId, quantity: 1 }],
          });
        }
    
        await cart.save();
    
        res.status(200).json({ success: true, message: "Product added to cart successfully." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }

};


exports.getCart = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const cart = await Cart.findOne({ userId }).populate("items.productId"); 
      
      if (!cart || cart.items.length === 0) {
        return res.status(404).json({ success: false, message: "Your cart is empty." });
      }
  
      res.status(200).json({ success: true, cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
};

exports.removeToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; 
    
        const cart = await Cart.findOne({ userId });
    
        if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
        }
    
    
        const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);
    
        cart.items = updatedItems;
        await cart.save();

        res.json({ success: true, cart });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error removing product from cart" });
      }
};

