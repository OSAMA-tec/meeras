import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import LogoWhite from '../assets/logo-white-removebg.png';
import LogoOrange from '../assets/logo-orange-removebg.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { state } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-primary-warm-gray/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-12 w-auto"
              >
                <img 
                  src={theme === 'dark' ? LogoOrange : LogoWhite}
                  alt="Artisanal Logo"
                  className="h-full w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks />
              <div className="flex items-center space-x-4">
                <CartIcon count={state.items.length} onClick={() => setIsCartOpen(true)} />
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <CartIcon count={state.items.length} onClick={() => setIsCartOpen(true)} />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black dark:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0 }}
            className={`md:hidden overflow-hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          >
            <div className="py-4">
              <NavLinks mobile />
              <div className="mt-4 flex justify-center">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </motion.div>
        </nav>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const location = useLocation();
  const baseClasses = "text-black dark:text-white hover:text-primary-orange dark:hover:text-primary-orange transition-colors duration-300";
  const activeClasses = "text-primary-orange dark:text-primary-orange";
  const classes = mobile ? `${baseClasses} block py-2 text-center` : baseClasses;
  
  const getClasses = (path: string) => {
    return `${classes} ${location.pathname === path ? activeClasses : ''}`;
  };

  return (
    <div className={mobile ? "flex flex-col" : "flex items-center space-x-8"}>
      <Link to="/" className={getClasses('/')}>Home</Link>
      <Link to="/shop" className={getClasses('/shop')}>Shop</Link>
      <Link to="/about" className={getClasses('/about')}>About</Link>
      <Link to="/contact" className={getClasses('/contact')}>Contact</Link>
    </div>
  );
}

function CartIcon({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="text-black dark:text-white hover:text-primary-orange dark:hover:text-primary-orange transition-colors duration-300"
      >
        <ShoppingCart size={24} />
      </button>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-white" />
      ) : (
        <Moon size={20} className="text-black" />
      )}
    </button>
  );
}