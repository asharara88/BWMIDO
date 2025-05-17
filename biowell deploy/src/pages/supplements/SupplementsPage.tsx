import { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, Package, Plus, ShoppingCart } from 'lucide-react';

interface Supplement {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  dosage: string;
  price: number;
  image_url: string;
}

interface CartItem {
  supplement: Supplement;
  quantity: number;
}

const SupplementsPage = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [userSupplements, setUserSupplements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchSupplements();
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
    } finally {
      setLoading(false);
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

  const filteredSupplements = supplements.filter(supplement => {
    return searchQuery === '' || 
      supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplement.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] pl-10 pr-4 py-2 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <button
          className="relative flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Cart ({cartItems.reduce((count, item) => count + item.quantity, 0)})</span>
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSupplements.map((supplement) => (
          <motion.div
            key={supplement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] overflow-hidden"
          >
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'}
                alt={supplement.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-semibold">{supplement.name}</h3>
              <p className="mb-2 text-sm text-text-light">{supplement.description}</p>
              
              <div className="mb-3 flex flex-wrap gap-1">
                {supplement.benefits?.slice(0, 3).map((benefit, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold">${supplement.price}</span>
                <button
                  onClick={() => addToCart(supplement)}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SupplementsPage;