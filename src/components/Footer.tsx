import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import LogoDark from '../assets/logo-dark-removebg.png';

const Footer = () => {
  return (
    <footer className="bg-primary-black dark:bg-primary-soft-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="h-24 w-auto">
              <img 
                src={LogoDark} 
                alt="Meeras Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-300">
              Crafting excellence in every product, delivering tradition to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Shop</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>123 Craft Street</li>
              <li>Artisan City, AC 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@Meeras.com</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-sm text-gray-300">Subscribe to receive updates and special offers.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary-orange"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-orange hover:bg-primary-bright-orange transition-colors duration-300 rounded-md"
              >
                <Mail size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Meeras. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-primary-orange transition-colors duration-300"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-primary-orange transition-colors duration-300"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-primary-orange transition-colors duration-300"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;