import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Grid, List } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Define product interface
interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}



// Mock product data (in a real app, this would come from an API)
const productData: Product[] = [
  {
    id: 1,
    name: "Handcrafted Wooden Bowl",
    price: 39.99,
    images: ["/images/products/wooden-bowl.jpg"],
    description: "Beautifully handcrafted wooden bowl made from sustainable oak.",
    category: "kitchen",
    rating: 4.5,
    reviews: 28,
    inStock: true,
    tags: ["handmade", "kitchen", "wood"],
  },
  {
    id: 2,
    name: "Ceramic Coffee Mug",
    price: 24.99,
    images: ["/images/products/ceramic-mug.jpg"],
    description: "Artisan-made ceramic coffee mug, perfect for your morning brew.",
    category: "kitchen",
    rating: 4.8,
    reviews: 42,
    inStock: true,
    tags: ["handmade", "kitchen", "ceramic"],
  },
  {
    id: 3,
    name: "Hand-woven Basket",
    price: 49.99,
    images: ["/images/products/woven-basket.jpg"],
    description: "Traditional hand-woven basket, perfect for storage or decoration.",
    category: "home",
    rating: 4.2,
    reviews: 19,
    inStock: true,
    tags: ["handmade", "home", "decoration"],
  },
  {
    id: 4,
    name: "Artisanal Soap Set",
    price: 32.99,
    images: ["/images/products/soap-set.jpg"],
    description: "Set of 4 handmade soaps with natural ingredients and essential oils.",
    category: "bath",
    rating: 4.9,
    reviews: 56,
    inStock: true,
    tags: ["handmade", "bath", "organic"],
  },
  {
    id: 5,
    name: "Leather Journal",
    price: 29.99,
    images: ["/images/products/leather-journal.jpg"],
    description: "Handbound leather journal with recycled paper pages.",
    category: "stationery",
    rating: 4.7,
    reviews: 33,
    inStock: false,
    tags: ["handmade", "stationery", "leather"],
  },
  {
    id: 6,
    name: "Macramé Wall Hanging",
    price: 59.99,
    images: ["/images/products/macrame.jpg"],
    description: "Intricate macramé wall hanging to add texture to any room.",
    category: "home",
    rating: 4.6,
    reviews: 27,
    inStock: true,
    tags: ["handmade", "home", "decoration"],
  },
  {
    id: 7,
    name: "Handblown Glass Vase",
    price: 79.99,
    images: ["/images/products/glass-vase.jpg"],
    description: "Unique handblown glass vase with swirling color patterns.",
    category: "home",
    rating: 4.8,
    reviews: 31,
    inStock: true,
    tags: ["handmade", "home", "glass"],
  },
  {
    id: 8,
    name: "Knitted Wool Throw",
    price: 89.99,
    images: ["/images/products/wool-throw.jpg"],
    description: "Warm and cozy hand-knitted wool throw blanket.",
    category: "home",
    rating: 4.9,
    reviews: 48,
    inStock: true,
    tags: ["handmade", "home", "textile"],
  },
];

// Available categories for filtering
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'home', name: 'Home & Decor' },
  { id: 'bath', name: 'Bath & Body' },
  { id: 'stationery', name: 'Stationery' },
];

// Price ranges for filtering
const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under25', name: 'Under $25' },
  { id: '25to50', name: '$25 to $50' },
  { id: '50to100', name: '$50 to $100' },
  { id: 'over100', name: 'Over $100' },
];

// Product card component for grid display
interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="backdrop-blur-sm bg-white/80 dark:bg-primary-soft-black/70 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://placehold.co/600x400/png" // Placeholder, replace with actual images in production
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-medium px-3 py-1 bg-red-500/70 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-primary-orange/90 text-white text-xs px-2 py-1 rounded-full font-medium">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{product.name}</h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : i < product.rating
                      ? 'text-yellow-400' // For half stars, you'd need a more complex setup
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({product.reviews})
            </span>
          </div>
          
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
              product.inStock
                ? 'bg-primary-orange hover:bg-primary-bright-orange text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className="backdrop-blur-sm bg-white/80 dark:bg-primary-soft-black/70 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 flex"
    >
      <div className="w-1/4 relative">
        <img
          src="https://placehold.co/600x400/png" // Placeholder, replace with actual images in production
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-medium px-3 py-1 bg-red-500/70 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-primary-orange/90 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {product.description}
            </p>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : i < product.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({product.reviews})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {product.inStock ? 
              <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>In Stock</span> : 
              <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>Out of Stock</span>
            }
          </div>
          
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 shadow ${
              product.inStock
                ? 'bg-primary-orange hover:bg-primary-bright-orange text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ShopPage: React.FC = () => {
  const { addToCart } = useCart();
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productData);
  const [sortBy, setSortBy] = useState('featured');

  // Apply filters
  useEffect(() => {
    let result = [...productData];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      result = result.filter(product => {
        const price = product.price;
        switch (selectedPriceRange) {
          case 'under25': return price < 25;
          case '25to50': return price >= 25 && price <= 50;
          case '50to100': return price > 50 && price <= 100;
          case 'over100': return price > 100;
          default: return true;
        }
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
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
  }, [searchTerm, selectedCategory, selectedPriceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart({ 
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 pb-12"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary-dark dark:text-white">
            Shop Our Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Discover unique handcrafted products made with passion
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
          <div className="w-full lg:w-2/3 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-primary-soft-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-primary-soft-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="nameAZ">Name: A to Z</option>
                <option value="nameZA">Name: Z to A</option>
                <option value="topRated">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="hidden md:flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
              <button
                className={`p-1.5 rounded ${displayMode === 'grid' ? 'bg-primary-orange text-white' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setDisplayMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-1.5 rounded ${displayMode === 'list' ? 'bg-primary-orange text-white' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setDisplayMode('list')}
              >
                <List size={18} />
              </button>
            </div>

            <button
              className="md:hidden flex items-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-primary-soft-black"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Sidebar (desktop) or Modal (mobile) */}
          <div
            className={`${
              showFilters
                ? 'fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end'
                : 'hidden md:block'
            } md:relative md:w-1/4 lg:w-1/5`}
          >
            <div className={`
              ${showFilters ? 'w-4/5 h-full overflow-y-auto' : 'w-full'}
              bg-white dark:bg-primary-soft-black p-6 rounded-lg shadow-lg md:shadow-none
            `}>
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-2 accent-primary-orange"
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
                <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <div key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range.id}`}
                        name="price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="mr-2 accent-primary-orange"
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

              {/* In Stock Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Availability</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    className="mr-2 accent-primary-orange"
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPriceRange('all');
                  setSearchTerm('');
                }}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400">No products match your criteria</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPriceRange('all');
                    setSearchTerm('');
                  }}
                  className="mt-4 py-2 px-4 bg-primary-orange text-white rounded-lg hover:bg-primary-bright-orange transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Showing {filteredProducts.length} products
                </p>
                
                {displayMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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