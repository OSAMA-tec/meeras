import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productService, ApiProduct } from '../services/api';
import { Link } from 'react-router-dom';

// Define product type
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  brand: string;
  description?: string;
  category?: string;
}

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const apiProducts = await productService.getProducts();

        // Transform API products for display
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

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: Number(product.id), // Convert string ID to number for CartContext
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image
    });
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
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
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                        {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
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
                      onClick={() => handleAddToCart(product)}
                      className="text-xs bg-primary-orange hover:bg-primary-bright-orange text-white px-3 py-1 rounded-full transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
