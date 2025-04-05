import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Award, Truck, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <>
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen flex items-center"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590422749897-47c47c871b4d?auto=format&fit=crop&q=80&w=2070')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-primary-orange font-semibold tracking-wider uppercase"
            >
              Handcrafted Excellence
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 text-5xl md:text-7xl font-display font-bold tracking-tight text-white sm:text-6xl"
            >
              Discover Our Latest Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-xl leading-8 text-gray-100 max-w-2xl mx-auto"
            >
              Explore our curated selection of premium artisanal products crafted with passion and tradition
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <a
                href="#products"
                className="rounded-md bg-primary-orange px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-bright-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-orange flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </a>
              <a
                href="#features"
                className="text-white text-lg font-semibold hover:text-primary-orange transition-colors duration-300"
              >
                Learn More →
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-primary-warm-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Artisanal?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Experience the difference of authentic craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                description: "Each product is carefully crafted using the finest materials and traditional techniques"
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Enjoy free worldwide shipping on all orders over $100"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Our dedicated team is always here to assist you with any queries"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary-orange text-white mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&q=80&w=2070')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20"></div>
            </div>
            <div className="relative py-24 px-8 sm:px-12 lg:px-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-display font-bold text-white mb-6">
                  Summer Collection 2025
                </h2>
                <p className="text-lg text-gray-200 mb-8">
                  Discover our latest collection of handcrafted pieces, perfect for the summer season.
                </p>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  View Collection
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;