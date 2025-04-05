import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-primary-warm-gray shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold dark:text-white">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 dark:text-white" />
                </button>
              </div>

              {state.items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm text-center mb-6">Looks like you haven't added any products to your cart yet.</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-primary-orange hover:bg-primary-bright-orange text-white rounded-full transition-colors shadow-md"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    {state.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold dark:text-white">{item.name}</h3>
                          <p className="text-primary-orange">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                            >
                              <Minus className="w-4 h-4 dark:text-white" />
                            </button>
                            <span className="dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                            >
                              <Plus className="w-4 h-4 dark:text-white" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium dark:text-white">
                        ${state.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                      <span className="font-medium dark:text-white">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                      <span className="text-lg font-semibold dark:text-white">Total</span>
                      <span className="text-lg font-semibold text-primary-orange">
                        ${state.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/checkout"
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-primary-orange hover:bg-primary-bright-orange text-white rounded-full transition-colors text-center font-medium shadow-md"
                      >
                        Proceed to Checkout
                      </Link>
                      <button
                        onClick={clearCart}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white text-center font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;