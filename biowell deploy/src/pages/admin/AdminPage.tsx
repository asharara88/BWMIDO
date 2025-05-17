import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Package, Activity, PlusCircle, Edit, Trash2, AlertTriangle, FileImage } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { supabase } = useSupabase();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (activeTab === 'users') {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setUsers(data || []);
        } else if (activeTab === 'supplements') {
          const { data, error } = await supabase
            .from('supplements')
            .select('*')
            .order('name', { ascending: true });
          
          if (error) throw error;
          setSupplements(data || []);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        
        // Mock data for demo
        if (activeTab === 'users') {
          setUsers([
            {
              id: '1',
              email: 'john.doe@example.com',
              first_name: 'John',
              last_name: 'Doe',
              is_admin: false,
              onboarding_completed: true,
              created_at: '2023-06-15T10:30:00Z',
            },
            {
              id: '2',
              email: 'jane.smith@example.com',
              first_name: 'Jane',
              last_name: 'Smith',
              is_admin: false,
              onboarding_completed: true,
              created_at: '2023-06-16T14:20:00Z',
            },
            {
              id: '3',
              email: 'admin@biowell.com',
              first_name: 'Admin',
              last_name: 'User',
              is_admin: true,
              onboarding_completed: true,
              created_at: '2023-06-01T09:00:00Z',
            },
          ]);
        } else if (activeTab === 'supplements') {
          setSupplements([
            {
              id: '1',
              name: 'Magnesium Glycinate',
              description: 'Supports sleep quality, muscle recovery, and stress reduction.',
              benefits: ['Sleep', 'Stress', 'Recovery'],
              dosage: '300-400mg before bed',
              price: 34.99,
              is_active: true,
              created_at: '2023-05-10T10:30:00Z',
            },
            {
              id: '2',
              name: 'Vitamin D3 + K2',
              description: 'Supports bone health, immune function, and mood regulation.',
              benefits: ['Immunity', 'Bone Health', 'Mood'],
              dosage: '5000 IU daily with fat-containing meal',
              price: 29.99,
              is_active: true,
              created_at: '2023-05-11T14:20:00Z',
            },
            {
              id: '3',
              name: 'Omega-3 Fish Oil',
              description: 'Supports heart health, brain function, and reduces inflammation.',
              benefits: ['Heart', 'Brain', 'Inflammation'],
              dosage: '1-2g daily with food',
              price: 39.99,
              is_active: true,
              created_at: '2023-05-12T09:00:00Z',
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, supabase, isAdmin, navigate]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleDeleteSupplement = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this supplement?');
    
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('supplements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSupplements(supplements.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting supplement:', error);
      alert('Failed to delete supplement');
    }
  };
  
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
        <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
        <p className="text-text-light">Manage users, supplements, and system settings</p>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 py-3 text-sm font-medium md:text-base
              ${activeTab === 'users'
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-light hover:text-primary'
              }`}
          >
            <Users className="h-5 w-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('supplements')}
            className={`flex items-center gap-2 py-3 text-sm font-medium md:text-base
              ${activeTab === 'supplements'
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-light hover:text-primary'
              }`}
          >
            <Package className="h-5 w-5" />
            Supplements
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 py-3 text-sm font-medium md:text-base
              ${activeTab === 'analytics'
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-light hover:text-primary'
              }`}
          >
            <Activity className="h-5 w-5" />
            Analytics
          </button>
          <button
            onClick={() => navigate('/admin/images')}
            className={`flex items-center gap-2 py-3 text-sm font-medium md:text-base
              ${activeTab === 'images'
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-light hover:text-primary'
              }`}
          >
            <FileImage className="h-5 w-5" />
            Images
          </button>
        </div>
      </div>
      
      {activeTab === 'users' && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">User Management</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {users.length} Users
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b text-left">
                <tr>
                  <th className="pb-3 font-medium text-text-light">Name</th>
                  <th className="pb-3 font-medium text-text-light">Email</th>
                  <th className="pb-3 font-medium text-text-light">Status</th>
                  <th className="pb-3 font-medium text-text-light">Role</th>
                  <th className="pb-3 font-medium text-text-light">Joined</th>
                  <th className="pb-3 font-medium text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      {user.onboarding_completed ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                          Onboarding
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {user.is_admin ? (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Admin
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-text-light">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3">{formatDate(user.created_at)}</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          className="rounded p-1 text-text-light hover:bg-gray-100 hover:text-primary"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded p-1 text-text-light hover:bg-red-50 hover:text-red-500"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'supplements' && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Supplement Management</h2>
            <button className="btn-primary flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Supplement
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b text-left">
                <tr>
                  <th className="pb-3 font-medium text-text-light">Name</th>
                  <th className="pb-3 font-medium text-text-light">Benefits</th>
                  <th className="pb-3 font-medium text-text-light">Dosage</th>
                  <th className="pb-3 font-medium text-text-light">Price</th>
                  <th className="pb-3 font-medium text-text-light">Status</th>
                  <th className="pb-3 font-medium text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {supplements.map((supplement) => (
                  <tr key={supplement.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium">{supplement.name}</div>
                      <div className="mt-1 text-xs text-text-light">
                        {supplement.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {supplement.benefits?.map((benefit: string) => (
                          <span
                            key={benefit}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-text-light"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">{supplement.dosage}</td>
                    <td className="py-3">${supplement.price}</td>
                    <td className="py-3">
                      {supplement.is_active ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          className="rounded p-1 text-text-light hover:bg-gray-100 hover:text-primary"
                          title="Edit Supplement"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSupplement(supplement.id)}
                          className="rounded p-1 text-text-light hover:bg-red-50 hover:text-red-500"
                          title="Delete Supplement"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            <div className="rounded-lg border border-gray-200 p-2 text-sm">
              Last 30 days
            </div>
          </div>
          
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-text-light">Total Users</div>
              <div className="mt-2 text-3xl font-bold">127</div>
              <div className="mt-1 text-xs text-success">↑ 12% from last month</div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-text-light">Active Subscriptions</div>
              <div className="mt-2 text-3xl font-bold">84</div>
              <div className="mt-1 text-xs text-success">↑ 8% from last month</div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-text-light">Total Revenue</div>
              <div className="mt-2 text-3xl font-bold">$3,248</div>
              <div className="mt-1 text-xs text-success">↑ 15% from last month</div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-text-light">Avg. Health Score</div>
              <div className="mt-2 text-3xl font-bold">76</div>
              <div className="mt-1 text-xs text-success">↑ 3 points from last month</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
              <h3 className="text-lg font-medium">Analytics Dashboard</h3>
              <p className="mt-2 text-text-light">
                Advanced analytics are in development. Check back soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;