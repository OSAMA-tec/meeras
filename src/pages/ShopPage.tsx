import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Grid, List, Loader, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productService, ApiProduct } from '../services/api';
import toast from 'react-hot-toast';

// Define product interface to use in component (mapped from API product)
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  description: string;
  category: string;
  brand: string;
  inStock: boolean;
  totalStock: number;
  rating: number;
}

// Available categories for filtering (will be updated dynamically based on API data)
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'women', name: 'Women' },
  { id: 'men', name: 'Men' },
  { id: 'kids', name: 'Kids' },
  { id: 'accessories', name: 'Accessories' },
];

// Price ranges for filtering
const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under500', name: 'Under ₹500' },
  { id: '500to1000', name: '₹500 to ₹1000' },
  { id: '1000to2000', name: '₹1000 to ₹2000' },
  { id: 'over2000', name: 'Over ₹2000' },
];

// Product card component for grid display
interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg font-semibold transform -rotate-12 shadow-lg">
              Out of Stock
            </div>
          </div>
        )}
        {/* Price tag */}
        <div className="absolute top-3 right-3">
          <div className="bg-primary-orange text-white font-medium px-3 py-1.5 rounded-lg shadow-lg">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xs line-through opacity-80">₹{product.price}</span>
                <span>₹{product.salePrice}</span>
              </div>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>
        </div>
        
        {/* Discount badge */}
        {product.salePrice && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white font-bold px-2 py-1 rounded-lg shadow-lg text-sm">
              {discount}% OFF
            </div>
          </div>
        )}
        
        {/* Quick add button that appears on hover */}
        {product.inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="w-full py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Brand and category */}
        <div className="flex items-center justify-between mb-2">
          {product.brand && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300 font-medium">
              {product.brand}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
            {product.category}
          </span>
        </div>
        
        {/* Product name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-orange transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 min-h-[40px]">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : i < product.rating
                      ? 'text-yellow-400 fill-yellow-400' // For half stars, you'd need a more complex setup
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          
          {/* Add to cart button */}
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              product.inStock
                ? 'bg-primary-orange hover:bg-primary-bright-orange text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Product list item component for list display
interface ProductListItemProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onAddToCart }) => {
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row"
    >
      <div className="sm:w-1/3 lg:w-1/4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg font-semibold transform -rotate-12 shadow-lg">
              Out of Stock
            </div>
          </div>
        )}
        {/* Price tag */}
        <div className="absolute top-3 right-3">
          <div className="bg-primary-orange text-white font-medium px-3 py-1.5 rounded-lg shadow-lg">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xs line-through opacity-80">₹{product.price}</span>
                <span>₹{product.salePrice}</span>
              </div>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>
        </div>
        
        {/* Discount badge */}
        {product.salePrice && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white font-bold px-2 py-1 rounded-lg shadow-lg text-sm">
              {discount}% OFF
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            {/* Brand and category */}
            <div className="flex items-center gap-2">
              {product.brand && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300 font-medium">
                  {product.brand}
                </span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                {product.category}
              </span>
            </div>
            
            {/* Stock status */}
            <div className="text-sm flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50">
              {product.inStock ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">In Stock ({product.totalStock})</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Out of Stock</span>
                </>
              )}
            </div>
          </div>
          
          {/* Product name */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-orange transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {product.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : i < product.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          
          {/* Price display for list view */}
          <div className="flex items-center gap-3 mt-2">
            {product.salePrice ? (
              <>
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm">₹{product.price}</span>
                <span className="text-primary-orange font-bold text-lg">₹{product.salePrice}</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                  {discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-primary-orange font-bold text-lg">₹{product.price}</span>
            )}
          </div>
        </div>
        
        {/* Add to cart button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className={`py-2.5 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
              product.inStock
                ? 'bg-primary-orange hover:bg-primary-bright-orange text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Empty state component
const EmptyState = ({ onClearFilters }: { onClearFilters: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        We couldn't find any products matching your current filters. Try adjusting your search or browse our categories.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-bright-orange transition-colors inline-flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Clear Filters
      </button>
    </motion.div>
  );
};

// Loading state component
const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader className="w-12 h-12 text-primary-orange animate-spin mb-4" />
      <p className="text-gray-600 dark:text-gray-300 text-lg">Loading products...</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please wait while we fetch the latest products</p>
    </div>
  );
};

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button 
          onClick={onRetry} 
          className="w-full py-3 bg-primary-orange hover:bg-primary-bright-orange text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const ShopPage: React.FC = () => {
  const { addToCart } = useCart();
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiProducts = await productService.getProducts();
      
      // Transform API products to our Product interface
      const transformedProducts = apiProducts.map((apiProduct: ApiProduct): Product => ({
        id: apiProduct._id,
        name: apiProduct.title,
        price: apiProduct.price,
        salePrice: apiProduct.salePrice || null,
        image: apiProduct.image,
        description: apiProduct.description,
        category: apiProduct.category,
        brand: apiProduct.brand,
        inStock: apiProduct.totalStock > 0 && apiProduct.isActive,
        totalStock: apiProduct.totalStock,
        rating: apiProduct.averageReview || 0,
      }));
      
      setAllProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
      toast.error('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let result = [...allProducts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      result = result.filter(product => {
        const price = product.salePrice || product.price;
        switch (selectedPriceRange) {
          case 'under500': return price < 500;
          case '500to1000': return price >= 500 && price <= 1000;
          case '1000to2000': return price > 1000 && price <= 2000;
          case 'over2000': return price > 2000;
          default: return true;
        }
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'priceHigh':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'nameZA':
          return b.name.localeCompare(a.name);
        case 'topRated':
          return b.rating - a.rating;
        default: // 'featured'
          return 0; // Keep original order
      }
    });
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, selectedPriceRange, sortBy, allProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart({ 
      id: Number(product.id), // Convert string ID to number for CartContext compatibility
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image
    });
    
    toast.success(`${product.name} added to cart!`);
  };
  
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSearchTerm('');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchProducts} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-3"
          >
            Shop Our Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Discover unique products made with passion and get the best deals on premium items
          </motion.p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="w-full lg:w-2/3 relative">
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full py-3 pl-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="nameAZ">Name: A to Z</option>
                  <option value="nameZA">Name: Z to A</option>
                  <option value="topRated">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              
              <div className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button
                  className={`p-2 rounded-md ${displayMode === 'grid' ? 'bg-primary-orange text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setDisplayMode('grid')}
                >
                  <Grid size={20} />
                </button>
                <button
                  className={`p-2 rounded-md ${displayMode === 'list' ? 'bg-primary-orange text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => setDisplayMode('list')}
                >
                  <List size={20} />
                </button>
              </div>

              <button
                className="md:hidden flex items-center gap-2 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Sidebar (desktop) or Modal (mobile) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex md:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween' }}
                  className="ml-auto w-4/5 h-full overflow-y-auto bg-white dark:bg-gray-800 p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X size={24} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                    </button>
                  </div>
                  
                  {/* Mobile filters content */}
                  <div className="space-y-8">
                    {/* Category Filter */}
                    <div>
                      <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Categories</h3>
                      <div className="space-y-3">
                        {categories.map(category => (
                          <div key={category.id} className="flex items-center">
                            <input
                              type="radio"
                              id={`mobile-category-${category.id}`}
                              name="mobile-category"
                              checked={selectedCategory === category.id}
                              onChange={() => setSelectedCategory(category.id)}
                              className="mr-3 h-4 w-4 accent-primary-orange"
                            />
                            <label
                              htmlFor={`mobile-category-${category.id}`}
                              className="text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Price Range</h3>
                      <div className="space-y-3">
                        {priceRanges.map(range => (
                          <div key={range.id} className="flex items-center">
                            <input
                              type="radio"
                              id={`mobile-price-${range.id}`}
                              name="mobile-price"
                              checked={selectedPriceRange === range.id}
                              onChange={() => setSelectedPriceRange(range.id)}
                              className="mr-3 h-4 w-4 accent-primary-orange"
                            />
                            <label
                              htmlFor={`mobile-price-${range.id}`}
                              className="text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              {range.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={clearFilters}
                      className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mt-4"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-1/4 lg:w-1/5">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                Filters
              </h3>
              
              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Categories</h4>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-3 h-4 w-4 accent-primary-orange"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h4 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Price Range</h4>
                <div className="space-y-3">
                  {priceRanges.map(range => (
                    <div key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range.id}`}
                        name="price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="mr-3 h-4 w-4 accent-primary-orange"
                      />
                      <label
                        htmlFor={`price-${range.id}`}
                        className="text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <EmptyState onClearFilters={clearFilters} />
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> products
                    {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                    {selectedPriceRange !== 'all' && ` with price range ${priceRanges.find(p => p.id === selectedPriceRange)?.name}`}
                  </p>
                </div>
                
                {displayMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredProducts.map(product => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPage; 