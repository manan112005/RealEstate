import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { MessageSquare, Search, ChevronLeft, ChevronRight, Mail, Phone, Clock, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal State
  const [readMoreModal, setReadMoreModal] = useState({ show: false, msg: null });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/admin/messages');
      // Ensure latest messages are first
      const sorted = (data.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMessages(sorted);
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for Date formatting
  const getFullDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getRelativeDate = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date - now;
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.round(diffInMs / (1000 * 60));

    if (Math.abs(diffInDays) > 7) {
      return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (Math.abs(diffInDays) > 0) {
      return rtf.format(diffInDays, 'day');
    } else if (Math.abs(diffInHours) > 0) {
      return rtf.format(diffInHours, 'hour');
    } else if (Math.abs(diffInMinutes) > 0) {
      return rtf.format(diffInMinutes, 'minute');
    } else {
      return 'Just now';
    }
  };

  // Filter & Pagination Logic
  const filteredMessages = useMemo(() => {
    return messages.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMessages.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMessages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-12 relative">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Contact Messages</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">View inquiries and messages from visitors.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-border-subtle)] mb-6">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages by sender name..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-sm border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto max-h-[650px] custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider w-40">Date Received</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider w-56">Sender Name</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider w-64">Contact Info</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {paginatedMessages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100">
                        <MessageSquare className="h-10 w-10 text-blue-400" />
                      </div>
                      <h3 className="text-[18px] font-extrabold text-[var(--color-text-primary)] mb-2">
                        {searchTerm ? 'No matching messages' : 'No messages yet'}
                      </h3>
                      <p className="text-[14px] text-[var(--color-text-secondary)] max-w-sm">
                        {searchTerm ? 'Try adjusting your search term.' : 'When users submit the contact form, their inquiries will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMessages.map((msg) => (
                  <tr key={msg.id} className="even:bg-gray-50/50 hover:bg-blue-50/40 transition-colors group align-top">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div 
                        className="inline-flex items-center text-[13px] font-bold text-[var(--color-text-secondary)] bg-white border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-lg shadow-sm cursor-help"
                        title={getFullDate(msg.created_at)}
                      >
                        <Clock size={14} className="mr-2 text-gray-400" />
                        {getRelativeDate(msg.created_at)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center text-[14px] font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <User size={16} />
                        </div>
                        {msg.name}
                      </div>
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <a href={`mailto:${msg.email}`} className="flex items-center text-[13px] font-bold text-[var(--color-text-secondary)] hover:text-blue-600 transition-colors w-max">
                          <Mail size={14} className="mr-2 text-gray-400" /> {msg.email}
                        </a>
                        <a href={`tel:${msg.phone}`} className="flex items-center text-[13px] font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors w-max bg-blue-50 px-2 py-1 rounded-md">
                          <Phone size={14} className="mr-2" /> {msg.phone}
                        </a>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="bg-white border border-[var(--color-border-subtle)] p-4 rounded-xl shadow-sm group-hover:border-blue-200 transition-colors">
                        <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 break-words">
                          {msg.message}
                        </p>
                        {msg.message.length > 100 && (
                          <button 
                            onClick={() => setReadMoreModal({ show: true, msg })}
                            className="mt-2 text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Read full message
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-gray-50/50 flex items-center justify-between">
            <div className="text-[13px] font-bold text-[var(--color-text-secondary)]">
              Showing <span className="text-[var(--color-text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-[var(--color-text-primary)]">{Math.min(currentPage * itemsPerPage, filteredMessages.length)}</span> of <span className="text-[var(--color-text-primary)]">{filteredMessages.length}</span> messages
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-text-primary)] shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-text-primary)] shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Read More Modal */}
      <AnimatePresence>
        {readMoreModal.show && readMoreModal.msg && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setReadMoreModal({ show: false, msg: null })}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-[var(--color-border-subtle)] bg-gray-50/50 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[var(--color-text-primary)]">{readMoreModal.msg.name}</h3>
                      <div className="text-[13px] font-bold text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        {getFullDate(readMoreModal.msg.created_at)}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReadMoreModal({ show: false, msg: null })}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Contact Info */}
                <div className="px-6 py-4 bg-white border-b border-[var(--color-border-subtle)] flex flex-wrap gap-4">
                  <a href={`mailto:${readMoreModal.msg.email}`} className="flex items-center text-[14px] font-bold text-[var(--color-text-secondary)] hover:text-blue-600 transition-colors bg-gray-50 px-3 py-2 rounded-lg border border-[var(--color-border-subtle)]">
                    <Mail size={16} className="mr-2 text-gray-400" /> {readMoreModal.msg.email}
                  </a>
                  <a href={`tel:${readMoreModal.msg.phone}`} className="flex items-center text-[14px] font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                    <Phone size={16} className="mr-2" /> {readMoreModal.msg.phone}
                  </a>
                </div>

                {/* Modal Message Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-[var(--color-border-subtle)]">
                    <h4 className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Message Content</h4>
                    <p className="text-[15px] text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap break-words">
                      {readMoreModal.msg.message}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default Messages;
