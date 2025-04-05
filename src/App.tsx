import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ShopPage from './pages/ShopPage';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <AnimatePresence mode="wait">
            <div className="min-h-screen bg-primary-cream dark:bg-primary-warm-gray transition-colors duration-300">
              <Toaster position="top-right" />
              <Header />
              <Routes>
                <Route path="/" element={
                  <main>
                    <Hero />
                    <ProductGrid />
                  </main>
                } />
                <Route path="/shop" element={<ShopPage />} />
              </Routes>
              <Footer />
            </div>
          </AnimatePresence>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;