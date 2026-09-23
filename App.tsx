import React, { useState, useMemo } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { RABBIT_PRODUCTS } from './data/products';
import { RabbitColorType, RabbitSize, Gender, RabbitProduct } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesBar } from './components/FeaturesBar';
import { CategoryHighlights } from './components/CategoryHighlights';
import { ShopBySize } from './components/ShopBySize';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { BulkOffersBanner } from './components/BulkOffersBanner';
import { RabbitCareGuide } from './components/RabbitCareGuide';
import { CustomerReviews } from './components/CustomerReviews';
import { RecentlyViewed } from './components/RecentlyViewed';
import { WishlistModal } from './components/WishlistModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Footer } from './components/Footer';
import { AiShoppingAssistant } from './components/AiShoppingAssistant';
import { CartToastNotification } from './components/CartToastNotification';
import { OrdersModal } from './components/OrdersModal';
import { BottomNavigation } from './components/BottomNavigation';
import { Filter, SlidersHorizontal, Sparkles, X, Heart, Flame, Star, Tag } from 'lucide-react';

function StoreContent() {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    lastOrder,
    wishlist,
  } = useCart();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<RabbitColorType | 'All'>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<RabbitSize | 'All'>('All');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<Gender | 'All'>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'All' | 'Popular Choice' | 'Fast Selling' | 'Special Offer' | 'Bulk Savings' | 'Wishlist'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  
  const [isOrderConfirmedModalOpen, setIsOrderConfirmedModalOpen] = useState(false);

  // Smooth Navigation
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (color: RabbitColorType) => {
    setSelectedColorFilter(color);
    setSelectedTagFilter('All');
    scrollToSection('catalogue');
  };

  const handleSelectSize = (size: RabbitSize) => {
    setSelectedSizeFilter(size);
    setSelectedTagFilter('All');
    scrollToSection('catalogue');
  };

  const handleSpecialOfferClick = () => {
    setSelectedTagFilter('Special Offer');
    setSortBy('discount');
    scrollToSection('catalogue');
  };

  const handleOrderPlaced = () => {
    setIsOrderConfirmedModalOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...RABBIT_PRODUCTS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.colorType.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.temperament.toLowerCase().includes(q)
      );
    }

    // Color Filter (Strictly Black & White or Pure White)
    if (selectedColorFilter !== 'All') {
      list = list.filter((p) => p.colorType === selectedColorFilter);
    }

    // Gender Filter
    if (selectedGenderFilter !== 'All') {
      list = list.filter((p) => p.gender === selectedGenderFilter);
    }

    // Size Filter
    if (selectedSizeFilter !== 'All') {
      list = list.filter((p) => p.defaultSize === selectedSizeFilter);
    }

    // Tag / Special Badge / Wishlist Filter
    if (selectedTagFilter === 'Wishlist') {
      list = list.filter((p) => wishlist.includes(p.id));
    } else if (selectedTagFilter !== 'All') {
      list = list.filter((p) => p.badge === selectedTagFilter);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.sizePricing[a.defaultSize].sellingPrice - b.sizePricing[b.defaultSize].sellingPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.sizePricing[b.defaultSize].sellingPrice - a.sizePricing[a.defaultSize].sellingPrice);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA =
          ((a.sizePricing[a.defaultSize].originalPrice - a.sizePricing[a.defaultSize].sellingPrice) /
            a.sizePricing[a.defaultSize].originalPrice) *
          100;
        const discB =
          ((b.sizePricing[b.defaultSize].originalPrice - b.sizePricing[b.defaultSize].sellingPrice) /
            b.sizePricing[b.defaultSize].originalPrice) *
          100;
        return discB - discA;
      });
    }

    return list;
  }, [searchQuery, selectedColorFilter, selectedGenderFilter, selectedSizeFilter, selectedTagFilter, sortBy, wishlist]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedColorFilter('All');
    setSelectedSizeFilter('All');
    setSelectedGenderFilter('All');
    setSelectedTagFilter('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedColorFilter !== 'All' ||
    selectedSizeFilter !== 'All' ||
    selectedGenderFilter !== 'All' ||
    selectedTagFilter !== 'All' ||
    sortBy !== 'featured';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedColorFilter={selectedColorFilter}
        setSelectedColorFilter={setSelectedColorFilter}
        selectedSizeFilter={selectedSizeFilter}
        setSelectedSizeFilter={setSelectedSizeFilter}
        selectedGenderFilter={selectedGenderFilter}
        setSelectedGenderFilter={setSelectedGenderFilter}
        onNavigateToSection={scrollToSection}
      />

      {/* Hero Section */}
      <Hero onShopNow={() => scrollToSection('catalogue')} />

      {/* 4 Feature Pillars Bar */}
      <FeaturesBar />

      {/* Category Highlights (Black & White, Pure White, Bulk Savings) */}
      <CategoryHighlights
        onSelectCategory={handleSelectCategory}
        onViewBulkOffers={() => scrollToSection('bulk-offers')}
      />

      {/* Shop By Size */}
      <ShopBySize
        onSelectSize={handleSelectSize}
        onSpecialOfferClick={handleSpecialOfferClick}
      />

      {/* Catalogue & Featured Rabbits Section */}
      <section id="catalogue" className="py-12 bg-gray-50/70 border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Healthy Pure Breeds</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
                Featured Rabbits & Full Catalogue
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Handpicked favorites for your perfect companion • Strictly Black & White and Pure White
              </p>
            </div>

            <div className="text-xs font-bold text-gray-500">
              Showing <span className="text-emerald-800 font-black">{filteredProducts.length}</span> of {RABBIT_PRODUCTS.length} rabbits
            </div>
          </div>

          {/* Filter & Sort Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-gray-200/80 mb-8 space-y-4">
            
            {/* Quick Collections / Sales Tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 scrollbar-none">
              <span className="text-xs font-bold text-gray-500 shrink-0">Discovery:</span>
              <button
                onClick={() => setSelectedTagFilter('All')}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTagFilter === 'All'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Rabbits ({RABBIT_PRODUCTS.length})
              </button>

              <button
                onClick={() => setSelectedTagFilter('Fast Selling')}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  selectedTagFilter === 'Fast Selling'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Fast Selling</span>
              </button>

              <button
                onClick={() => setSelectedTagFilter('Popular Choice')}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  selectedTagFilter === 'Popular Choice'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Popular Choice</span>
              </button>

              <button
                onClick={() => setSelectedTagFilter('Special Offer')}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  selectedTagFilter === 'Special Offer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Special Offers</span>
              </button>

              <button
                onClick={() => setSelectedTagFilter('Bulk Savings')}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  selectedTagFilter === 'Bulk Savings'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bulk Savings</span>
              </button>

              <button
                onClick={() => setSelectedTagFilter('Wishlist')}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  selectedTagFilter === 'Wishlist'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Wishlist ({wishlist.length})</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Color Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-gray-600 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span>Color:</span>
                </span>
                {(['All', 'Black & White', 'Pure White'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColorFilter(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedColorFilter === color
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color === 'All' ? 'All Colors' : color}
                  </button>
                ))}
              </div>

              {/* Gender Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-gray-600 mr-1">Gender:</span>
                {(['All', 'Male', 'Female'] as const).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGenderFilter(gender)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedGenderFilter === gender
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {gender === 'All' ? 'All' : gender === 'Male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>

              {/* Size Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-gray-600 mr-1">Size:</span>
                {(['All', 'Small', 'Medium', 'Large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizeFilter(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSizeFilter === size
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Highest Discount %</option>
                </select>
              </div>

            </div>

            {/* Active Filters Bar */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 font-semibold">Active filters:</span>
                  {selectedTagFilter !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                      Tag: {selectedTagFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTagFilter('All')} />
                    </span>
                  )}
                  {selectedColorFilter !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                      {selectedColorFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedColorFilter('All')} />
                    </span>
                  )}
                  {selectedGenderFilter !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-900 font-bold px-2 py-0.5 rounded-md">
                      {selectedGenderFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGenderFilter('All')} />
                    </span>
                  )}
                  {selectedSizeFilter !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                      {selectedSizeFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSizeFilter('All')} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 font-bold px-2 py-0.5 rounded-md">
                      Keyword: "{searchQuery}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                </div>

                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 space-y-3">
              <p className="text-lg font-bold text-gray-800">No rabbits match your current filter criteria.</p>
              <p className="text-xs text-gray-500">Try resetting your filters or browsing Black & White or Pure White rabbits.</p>
              <button
                onClick={resetFilters}
                className="inline-block bg-emerald-900 text-white font-bold text-xs px-5 py-2 rounded-full cursor-pointer mt-2"
              >
                Show All 25 Rabbits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={setSelectedProductForModal}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Recently Viewed Carousel Strip */}
      <RecentlyViewed onOpenQuickView={setSelectedProductForModal} />

      {/* Bulk Offers Banner Section */}
      <BulkOffersBanner onExploreRabbits={() => scrollToSection('catalogue')} />

      {/* Customer Reviews & Star Ratings */}
      <CustomerReviews />

      {/* Rabbit Care & Diet Guide */}
      <RabbitCareGuide />

      {/* Why Choose Us Banner */}
      <WhyChooseUs />

      {/* Footer */}
      <Footer
        onSelectColor={setSelectedColorFilter}
        onNavigateToSection={scrollToSection}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal onOrderPlaced={handleOrderPlaced} />

      {/* Order Confirmation Modal with WhatsApp message */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmedModalOpen}
        onClose={() => setIsOrderConfirmedModalOpen(false)}
      />

      {/* Wishlist Drawer Modal */}
      <WishlistModal onOpenQuickView={setSelectedProductForModal} />

      {/* Side-by-Side Rabbit Comparison Modal */}
      <ProductCompareModal onOpenQuickView={setSelectedProductForModal} />

      {/* Product Quick View & Specs Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onSelectAnotherProduct={(prod) => setSelectedProductForModal(prod)}
      />

      {/* Floating Cart Notification Toast */}
      <CartToastNotification />

      {/* Orders / Order History Modal */}
      <OrdersModal onExploreRabbits={() => scrollToSection('catalogue')} />

      {/* Modern E-Commerce Bottom Navigation (Home, Cart, Orders) */}
      <BottomNavigation onGoHome={() => scrollToSection('hero')} />

      {/* AI Shopping Assistant (BunnyAssist AI) */}
      <AiShoppingAssistant />

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreContent />
    </CartProvider>
  );
}
