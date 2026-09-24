import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Home, MessageSquare, Users, Settings, ArrowRight, Activity, Calendar, MoreHorizontal, Edit, AlertCircle, PlusCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [data, setData] = useState({
    properties: [],
    messages: [],
    partners: [],
    services: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [propertiesRes, messagesRes, partnersRes, servicesRes] = await Promise.all([
          api.get('/admin/properties').catch(() => ({ data: { data: [] } })),
          api.get('/admin/messages').catch(() => ({ data: { data: [] } })),
          api.get('/partners').catch(() => ({ data: { data: [] } })),
          api.get('/services').catch(() => ({ data: { data: [] } }))
        ]);
        
        setData({
          properties: propertiesRes.data?.data || [],
          messages: messagesRes.data?.data || [],
          partners: partnersRes.data?.data || [],
          services: servicesRes.data?.data || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      name: 'Total Properties', 
      value: data.properties.length, 
      icon: Home, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      link: '/admin/properties',
      emptyText: 'Add your first property'
    },
    { 
      name: 'Total Inquiries', 
      value: data.messages.length, 
      icon: MessageSquare, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      link: '/admin/messages',
      emptyText: 'No messages yet'
    },
    { 
      name: 'Active Partners', 
      value: data.partners.length, 
      icon: Users, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      link: '/admin/partners',
      emptyText: 'Add a bank partner'
    },
    { 
      name: 'Services Offered', 
      value: data.services.length, 
      icon: Settings, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50',
      link: '/admin/services',
      emptyText: 'Add your first service'
    }
  ];

  const recentProperties = data.properties.slice(0, 5);
  const recentMessages = data.messages.slice(0, 3);

  // Helper for listing type badge
  const getListingTypeColor = (type) => {
    switch (type) {
      case 'sale': return 'bg-blue-100 text-blue-800';
      case 'rent': return 'bg-green-100 text-green-800';
      case 'preleased': return 'bg-purple-100 text-purple-800';
      case 'auction': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Overview</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Your platform's performance at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-subtle)] overflow-hidden hover:shadow-md transition-shadow group relative">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                  <item.icon size={24} className={item.color} />
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{item.name}</p>
                  <p className="text-3xl font-extrabold text-[var(--color-text-primary)] mt-1">
                    {loading ? <span className="animate-pulse bg-gray-200 h-8 w-16 rounded inline-block"></span> : item.value}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                {item.value > 0 || loading ? (
                  <Link to={item.link} className="flex items-center text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                    View all details
                    <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <Link to={item.link} className="flex items-center text-sm font-semibold text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                    <PlusCircle size={16} className="mr-1.5" /> {item.emptyText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>



    </div>
  );
};

export default Dashboard;