import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Award, Truck, Clock, Star, ArrowRight } from 'lucide-react';
import { productService, ApiProduct } from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Featured product card component
interface FeaturedProductProps {
  product: FeaturedProduct;
  onAddToCart: () => void;
}

// Define product type for featured products
interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  brand: string;
  description?: string;
  category?: string;
}

const FeaturedProductCard: React.FC<FeaturedProductProps> = ({ product, onAddToCart }) => {
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.salePrice && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-primary-orange text-white text-xs px-2 py-1 rounded-full font-medium">
            ₹{product.salePrice ? product.salePrice : product.price}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
          {product.brand && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
              {product.brand}
            </span>
          )}
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Top Rated</p>
          </div>
          <button
            onClick={onAddToCart}
            className="text-xs bg-primary-orange hover:bg-primary-bright-orange text-white px-3 py-1 rounded-full transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImages, setBackgroundImages] = useState<{_id: string, image: string}[]>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const apiProducts = await productService.getProducts();
        
        // Transform API products for featured display
        const transformedProducts = apiProducts.map((apiProduct: ApiProduct) => ({
          id: apiProduct._id,
          name: apiProduct.title,
          price: apiProduct.price,
          salePrice: apiProduct.salePrice || null,
          image: apiProduct.image,
          description: apiProduct.description,
          category: apiProduct.category,
          brand: apiProduct.brand,
        }));
        
        // Shuffle array and take 4 random products (or fewer if less than 4 exist)
        const shuffled = [...transformedProducts].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Fetch background images from API
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const response = await fetch('https://server-28aj.onrender.com/api/common/feature/get');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          setBackgroundImages(result.data);
        }
      } catch (error) {
        console.error('Error fetching background images:', error);
      }
    };
    
    fetchBackgroundImages();
  }, []);

  // Rotate background images if multiple are available
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length);
    }, 8000); // Change image every 8 seconds
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleAddToCart = (product: FeaturedProduct) => {
    addToCart({ 
      id: Number(product.id), // Convert string ID to number for CartContext
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image
    });
  };

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
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{
            backgroundImage: backgroundImages.length > 0 
              ? `url('${backgroundImages[currentBgIndex].image}')`
              : "url('https://images.unsplash.com/photo-1590422749897-47c47c871b4d?auto=format&fit=crop&q=80&w=2070')", // Fallback image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Image indicator dots for multiple images */}
        {backgroundImages.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBgIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentBgIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-primary-orange font-semibold tracking-wider uppercase"
            >
              Premium Shopping Experience
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
              Explore our curated selection of premium products with the best deals and offers
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                to="/shop"
                className="rounded-md bg-primary-orange px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-bright-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-orange flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
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
              Why Choose Us?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Experience the difference of quality products with amazing service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                description: "Each product is carefully selected to ensure the highest quality standards"
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Enjoy free shipping on all orders over ₹1000"
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

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover our handpicked selection of top products
              </p>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-primary-orange hover:text-primary-bright-orange transition-colors">
              <span className="font-medium">View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => handleAddToCart(product)} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
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
                  Discover our latest collection of premium pieces, perfect for the summer season.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    to="/shop"
                    className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    View Collection
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;