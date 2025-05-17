import { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import SupplementCard from '../../components/supplements/SupplementCard';
import ShoppingCartSidebar from '../../components/supplements/ShoppingCartSidebar';
import StackBuilder from '../../components/supplements/StackBuilder';
import CheckoutForm from '../../components/supplements/CheckoutForm';
import SupplementRecommender from '../../components/supplements/SupplementRecommender';

interface Supplement {
  id: string;
  name: string;
  description: string;
  benefits: string[] | null;
  dosage: string | null;
  price: number;
  price_aed: number;
  image_url: string | null;
  categories?: string[];
  evidence_level?: string;
  use_cases?: string[];
  form_type?: string;
  form_image_url?: string;
}

interface SupplementStack {
  id: string;
  name: string;
  description: string;
  category: string;
  supplements: string[];
  total_price: number;
}

interface CartItem {
  supplement: Supplement;
  quantity: number;
}

const SupplementsPage = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [stacks, setStacks] = useState<SupplementStack[]>([]);
  const [userSupplements, setUserSupplements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<'browse' | 'stacks' | 'recommend' | 'checkout'>('browse');
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchSupplements();
    fetchStacks();
    if (user) {
      fetchUserSupplements();
    }
    
    const savedCart = localStorage.getItem('biowell-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error loading cart from localStorage:', err);
      }
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('biowell-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchSupplements = async () => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setSupplements(data || []);
    } catch (err) {
      console.error('Error fetching supplements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStacks = async () => {
    try {
      const { data, error } = await supabase
        .from('supplement_stacks')
        .select('*');

      if (error) throw error;
      setStacks(data || []);
    } catch (err) {
      console.error('Error fetching supplement stacks:', err);
    }
  };

  const fetchUserSupplements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_supplements')
        .select('supplement_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserSupplements(data?.map(us => us.supplement_id) || []);
    } catch (err) {
      console.error('Error fetching user supplements:', err);
    }
  };

  const toggleSubscription = async (supplementId: string) => {
    if (!user) return;

    const isSubscribed = userSupplements.includes(supplementId);

    try {
      if (isSubscribed) {
        await supabase
          .from('user_supplements')
          .delete()
          .eq('supplement_id', supplementId)
          .eq('user_id', user.id);

        setUserSupplements(prevSupplements =>
          prevSupplements.filter(us => us !== supplementId)
        );
      } else {
        await supabase
          .from('user_supplements')
          .insert({
            user_id: user.id,
            supplement_id: supplementId,
            subscription_active: true
          });
        setUserSupplements(prev => [...prev, supplementId]);
      }
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  const addToCart = (supplement: Supplement) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.supplement.id === supplement.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.supplement.id === supplement.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { supplement, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (supplementId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(supplementId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.supplement.id === supplementId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const removeFromCart = (supplementId: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.supplement.id !== supplementId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutComplete = () => {
    clearCart();
    setActiveView('browse');
  };

  const filteredSupplements = supplements.filter(supplement => {
    return searchQuery === '' || 
      supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplement.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredStacks = stacks.filter(stack => {
    return searchQuery === '' || 
      stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stack.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination logic
  const pageSupplements = filteredSupplements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const pageStacks = filteredStacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate total pages based on combined items
  const totalItems = filteredSupplements.length + filteredStacks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => 
    total + (item.supplement.price_aed * item.quantity), 0
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (activeView === 'checkout') {
    return (
      <CheckoutForm 
        cartItems={cartItems} 
        onCheckoutComplete={handleCheckoutComplete}
        onBack={() => setActiveView('browse')}
      />
    );
  }

  return (
    <div className="container mx-auto overflow-x-hidden max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Supplement Store</h1>
        <p className="text-text-light">Evidence-based supplements tailored to your health needs</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search supplements..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] pl-10 pr-4 py-2 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveView('browse')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeView === 'browse' 
                ? 'bg-primary text-white' 
                : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveView('stacks')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeView === 'stacks' 
                ? 'bg-primary text-white' 
                : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
            }`}
          >
            My Stacks
          </button>
          <button
            onClick={() => setActiveView('recommend')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeView === 'recommend' 
                ? 'bg-primary text-white' 
                : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
            }`}
          >
            AI Recommend
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
              {cartItems.reduce((count, item) => count + item.quantity, 0)}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Content */}
        <div className="md:col-span-9 overflow-x-hidden max-w-full">
          {activeView === 'browse' ? (
            <>
              {/* Supplements Section */}
              {pageSupplements.length > 0 && (
                <div className="mb-8 overflow-x-hidden max-w-full">
                  <h2 className="mb-4 text-xl font-bold">Supplements</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pageSupplements.map((supplement) => (
                      <SupplementCard
                        key={supplement.id}
                        supplement={supplement}
                        isInStack={userSupplements.includes(supplement.id)}
                        onAddToStack={() => toggleSubscription(supplement.id)}
                        onRemoveFromStack={() => toggleSubscription(supplement.id)}
                        onAddToCart={() => addToCart(supplement)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Stacks Section */}
              {pageStacks.length > 0 && (
                <div className="mb-8 overflow-x-hidden max-w-full">
                  <h2 className="mb-4 text-xl font-bold">Supplement Stacks</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pageStacks.map((stack) => (
                      <motion.div
                        key={stack.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{stack.name}</h3>
                          <p className="mb-3 text-sm text-text-light">{stack.description}</p>
                          
                          <div className="mb-3 flex flex-wrap gap-1">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {stack.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold">AED {stack.total_price.toFixed(2)}</span>
                          <button
                            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                          >
                            View Stack
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-4 mb-8">
                  <button 
                    onClick={() => setCurrentPage(p => p-1)} 
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md hover:bg-[hsl(var(--color-card-hover))] dark:hover:bg-[hsl(var(--color-card-hover))] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button 
                      key={i+1} 
                      onClick={() => setCurrentPage(i+1)}
                      className={`px-3 py-1 rounded-md hover:bg-[hsl(var(--color-card-hover))] dark:hover:bg-[hsl(var(--color-card-hover))] ${
                        currentPage === i+1 ? 'font-bold underline text-primary' : ''
                      }`}
                    >
                      {i+1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(p => p+1)} 
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md hover:bg-[hsl(var(--color-card-hover))] dark:hover:bg-[hsl(var(--color-card-hover))] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* No Results Message */}
              {filteredSupplements.length === 0 && filteredStacks.length === 0 && (
                <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-8 text-center">
                  <p className="text-text-light">No supplements or stacks found matching your search criteria.</p>
                </div>
              )}
            </>
          ) : activeView === 'stacks' ? (
            <div className="overflow-x-hidden max-w-full">
              <StackBuilder 
                supplements={supplements}
                userSupplements={userSupplements}
                onToggleSubscription={toggleSubscription}
              />
            </div>
          ) : activeView === 'recommend' && (
            <div className="overflow-x-hidden max-w-full">
              <SupplementRecommender />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-3">
          <ShoppingCartSidebar
            cartItems={cartItems}
            updateQuantity={updateCartQuantity}
            removeItem={removeFromCart}
            clearCart={clearCart}
            total={cartTotal}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplementsPage;