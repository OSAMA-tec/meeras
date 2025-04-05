import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Check, CreditCard, DollarSign, Truck, ShoppingBag } from 'lucide-react';

interface FormData {
  // User details
  name: string;
  email: string;
  phone: string;
  
  // Shipping address
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  
  // Billing address
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  
  // Payment
  paymentMethod: 'cod' | 'credit' | 'paypal';
  
  // Options
  sameAsBilling: boolean;
}

// Step indicators component
const CheckoutSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['Information', 'Shipping', 'Payment'];
  
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index + 1 <= currentStep ? 'bg-primary-orange border-primary-orange text-white' : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}>
              {index + 1 <= currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className={`text-xs mt-1 ${
              index + 1 <= currentStep ? 'text-primary-orange' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-[2px] mx-2 ${
              index + 1 < currentStep ? 'bg-primary-orange' : 'bg-gray-300 dark:bg-gray-600'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [currentStep] = useState(3); // Showing all steps completed for demo
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',
    
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: '',
    
    paymentMethod: 'cod',
    sameAsBilling: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handling form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Copy shipping address to billing address when checkbox is checked
  const handleSameAsBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsBilling: checked,
      // If checked, copy shipping address to billing address
      ...(checked ? {
        billingAddress: prev.shippingAddress,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingZip: prev.shippingZip,
        billingCountry: prev.shippingCountry,
      } : {})
    }));
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the order to your backend
      // For demo purposes, we'll just simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate order summary
  const subtotal = state.total;
  const shipping = 10.00; // Example fixed shipping cost
  const total = subtotal + shipping;
  
  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4 dark:text-white">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">There are no items in your cart to checkout. Explore our shop to discover handcrafted artisanal products.</p>
          <motion.button 
            onClick={() => navigate('/shop')} 
            className="px-8 py-3 bg-primary-orange hover:bg-primary-bright-orange text-white rounded-full transition-colors shadow-md text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-24"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-4 text-center dark:text-white">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
          Complete your purchase by providing your details below. All transactions are secure and encrypted.
        </p>
        
        <CheckoutSteps currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <motion.section 
                className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-primary-orange/10 dark:bg-primary-orange/20 p-2 rounded-full mr-4">
                    <Check className="w-5 h-5 text-primary-orange" />
                  </div>
                  <h2 className="text-xl font-semibold dark:text-white">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="(123) 456-7890"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>
              </motion.section>
              
              {/* Shipping Address */}
              <motion.section 
                className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-primary-orange/10 dark:bg-primary-orange/20 p-2 rounded-full mr-4">
                    <Truck className="w-5 h-5 text-primary-orange" />
                  </div>
                  <h2 className="text-xl font-semibold dark:text-white">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Street Address</label>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      placeholder="123 Main St"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">City</label>
                    <input
                      type="text"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      required
                      placeholder="New York"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">State/Province</label>
                    <input
                      type="text"
                      name="shippingState"
                      value={formData.shippingState}
                      onChange={handleChange}
                      required
                      placeholder="NY"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="shippingZip"
                      value={formData.shippingZip}
                      onChange={handleChange}
                      required
                      placeholder="10001"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Country</label>
                    <select
                      name="shippingCountry"
                      value={formData.shippingCountry}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-white dark:bg-gray-700"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="NZ">New Zealand</option>
                    </select>
                  </div>
                </div>
              </motion.section>
              
              {/* Billing Address */}
              <motion.section 
                className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="bg-primary-orange/10 dark:bg-primary-orange/20 p-2 rounded-full mr-4">
                      <Check className="w-5 h-5 text-primary-orange" />
                    </div>
                    <h2 className="text-xl font-semibold dark:text-white">Billing Address</h2>
                  </div>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <input
                      type="checkbox"
                      id="sameAsBilling"
                      name="sameAsBilling"
                      checked={formData.sameAsBilling}
                      onChange={handleSameAsBillingChange}
                      className="mr-2 h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
                    />
                    <label htmlFor="sameAsBilling" className="text-sm font-medium dark:text-gray-200">
                      Same as shipping address
                    </label>
                  </div>
                </div>
                
                {!formData.sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 dark:text-gray-200">Street Address</label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                        required
                        placeholder="123 Main St"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-200">City</label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        required
                        placeholder="New York"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-200">State/Province</label>
                      <input
                        type="text"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleChange}
                        required
                        placeholder="NY"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-200">ZIP/Postal Code</label>
                      <input
                        type="text"
                        name="billingZip"
                        value={formData.billingZip}
                        onChange={handleChange}
                        required
                        placeholder="10001"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-200">Country</label>
                      <select
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-white dark:bg-gray-700"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="NZ">New Zealand</option>
                      </select>
                    </div>
                  </div>
                )}
                {formData.sameAsBilling && (
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                    Your billing address will be the same as your shipping address.
                  </p>
                )}
              </motion.section>
              
              {/* Payment Method */}
              <motion.section 
                className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-primary-orange/10 dark:bg-primary-orange/20 p-2 rounded-full mr-4">
                    <DollarSign className="w-5 h-5 text-primary-orange" />
                  </div>
                  <h2 className="text-xl font-semibold dark:text-white">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 transition-all duration-200 hover:shadow-md dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="h-5 w-5 text-primary-orange focus:ring-primary-orange"
                    />
                    <label htmlFor="cod" className="ml-3 flex items-center flex-1">
                      <DollarSign className="w-5 h-5 mr-3 text-primary-orange" />
                      <span className="font-medium dark:text-white">Cash on Delivery (COD)</span>
                      <span className="ml-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs py-1 px-2 rounded-full">
                        Available
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 opacity-50 cursor-not-allowed">
                    <input
                      type="radio"
                      id="credit"
                      name="paymentMethod"
                      value="credit"
                      disabled
                      className="h-5 w-5 text-gray-400"
                    />
                    <label htmlFor="credit" className="ml-3 flex items-center flex-1">
                      <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="font-medium text-gray-500 dark:text-gray-400">Credit Card</span>
                      <span className="ml-auto bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-xs py-1 px-2 rounded-full">
                        Coming Soon
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 opacity-50 cursor-not-allowed">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      disabled
                      className="h-5 w-5 text-gray-400"
                    />
                    <label htmlFor="paypal" className="ml-3 flex items-center flex-1">
                      <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="font-medium text-gray-500 dark:text-gray-400">PayPal</span>
                      <span className="ml-auto bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-xs py-1 px-2 rounded-full">
                        Coming Soon
                      </span>
                    </label>
                  </div>
                </div>
              </motion.section>
              
              {/* Submit button (mobile only) */}
              <div className="lg:hidden">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary-orange hover:bg-primary-bright-orange text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700 sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary-orange" />
                Order Summary
              </h2>
              
              <div className="max-h-64 overflow-y-auto mb-6 pr-2 space-y-3">
                {state.items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium dark:text-white">{item.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm">Qty: {item.quantity}</span>
                        <span className="text-primary-orange font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-3 py-4 border-t border-b dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-medium dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="font-medium dark:text-white">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="font-medium dark:text-white">$0.00</span>
                </div>
              </div>
              
              <div className="flex justify-between py-4 text-lg font-semibold">
                <span className="dark:text-white">Total</span>
                <span className="text-primary-orange">${total.toFixed(2)}</span>
              </div>
              
              {/* Desktop submit button */}
              <div className="hidden lg:block mt-6">
                <motion.button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full py-4 bg-primary-orange hover:bg-primary-bright-orange text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </motion.button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage; 