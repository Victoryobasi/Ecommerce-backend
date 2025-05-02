const Cart = require('../models/Cart')


const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const parsedQuantity = parseInt(quantity);

        // Validate input
        if (!productId || !quantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product or quantity'
            });
        }

        let message;
        let cartResponse;

        // For authenticated users - save to database and clear session cart
        if (req.user) {
            // First check if there's a session cart to transfer
            if (req.session.cart?.products?.length) {
                await transferSessionCartToDatabase(req);
                message = 'Your session cart has been saved';
            } else {
                message = 'Product added to cart';
            }

            // Now handle the current product
            let dbCart = await Cart.findOne({ user: req.user._id });

            if (dbCart) {
                const productIndex = dbCart.products.findIndex(
                    item => item.product.toString() === productId.toString()
                );

                if (productIndex >= 0) {
                    dbCart.products[productIndex].quantity += parsedQuantity;
                } else {
                    dbCart.products.push({
                        product: productId,
                        quantity: parsedQuantity
                    });
                }
                dbCart.updatedAt = new Date();
                await dbCart.save();
            } else {
                dbCart = await Cart.create({
                    user: req.user._id,
                    products: [{
                        product: productId,
                        quantity: parsedQuantity
                    }],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            cartResponse = {
                products: dbCart.products.map(item => ({
                    productId: item.product,
                    quantity: item.quantity
                })),
                itemCount: dbCart.products.length
            };

            // Clear session cart after transfer
            req.session.cart = null;
        }
        // For guests - save to session only
        else {
            if (!req.session.cart) {
                req.session.cart = { products: [] };
            }

            const cart = req.session.cart;
            const productIndex = cart.products.findIndex(
                item => item.productId.toString() === productId.toString()
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += parsedQuantity;
            } else {
                cart.products.push({
                    productId,
                    quantity: parsedQuantity
                });
            }

            message = 'Cart has been stored in session';
            cartResponse = {
                products: cart.products,
                itemCount: cart.products.length
            };
        }

        res.status(200).json({
            success: true,
            message,
            cart: cartResponse,
            isAuthenticated: !!req.user
        });

    } catch (error) {
        console.error('Cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

// Helper function to transfer session cart to database
async function transferSessionCartToDatabase(req) {
    let dbCart = await Cart.findOne({ user: req.user._id });
    const sessionProducts = req.session.cart.products;

    if (!dbCart) {
        // Create new cart with session items
        return await Cart.create({
            user: req.user._id,
            products: sessionProducts.map(item => ({
                product: item.productId,
                quantity: item.quantity
            })),
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // Merge session cart with existing database cart
    // Loop through each item in the session cart
    sessionProducts.forEach(sessionItem => {
        // Check if the product already exists in the database cart
        const existingIndex = dbCart.products.findIndex(
            dbItem => dbItem.product.toString() === sessionItem.productId.toString()
        );

        // If product exists in database cart(update quantity)
        if (existingIndex >= 0) {
            dbCart.products[existingIndex].quantity += sessionItem.quantity;

            // If product doesn't exist in database cart (add new item)
        } else {
            dbCart.products.push({
                product: sessionItem.productId,
                quantity: sessionItem.quantity
            });
        }
    });

    dbCart.updatedAt = new Date();
    await dbCart.save();
}

// get users cart added
const getUserCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Check if the cart exists
        const cart = await Cart.findOne({ user: userId }).populate('products.product');

        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'User cart retrieved successfully',
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message || error,
        });
    }
};

// Get Guest session cart
const getGuestCart = async (req, res, next) => {
    try {
        const cart = req.session.cart || { products: [] };
        res.status(200).json({
            success: true,
            message: 'Guest cart retrieved successfully',
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message || error,
        });
    }
}


// remove product from cart
const removeProductFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        // Validate input
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        // Check if the cart exists

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        // Check if the product exists in the cart
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );
        if (existingProductIndex < 0) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
        // Remove the product from the cart
        cart.products.splice(existingProductIndex, 1);
        await cart.save();
        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: {
                products: cart.products,
                itemsCount: cart.products.length 
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message || error,
        });
    }
}

// remove product from cart for guest
const removeProductFromGuestCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        // Validate input
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        // Check if the cart exists
        let cart = req.session.cart || { products: [] };
        // Check if the product exists in the cart
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );
        if (existingProductIndex < 0) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
        // Remove the product from the cart
        cart.products.splice(existingProductIndex, 1);
        req.session.cart = cart; // Update session cart
        res.status(200).json({
            success: true,
            message: 'Product removed from guest cart',
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message || error,
        });
    }
}


// decrement quantity of product in cart
const decrementProductQuantity = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        // Validate input
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        // Check if the cart exists
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        // Check if the product exists in the cart
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );
        if (existingProductIndex < 0) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
        // Decrement the quantity
        const product = cart.products[existingProductIndex];
        if (product.quantity > 1) {
            product.quantity -= 1;
        } else {
            // If quantity is 1, remove the product from the cart
            cart.products.splice(existingProductIndex, 1);
        }
        await cart.save();
        res.status(200).json({
            success: true,
            message: 'Product quantity decremented',
            cart,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message || error,
        });
    }
}




module.exports = {
    addToCart,
    getUserCart,
    decrementProductQuantity,
    removeProductFromCart,
    getGuestCart,
    removeProductFromGuestCart

}