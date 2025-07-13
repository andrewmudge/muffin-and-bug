'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Heart, Camera, Star } from 'lucide-react';
import { format, parseISO, getYear } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { blogService } from '@/lib/blog-service';
import BlogCard from '@/components/blog-card';
import YearNavigation from '@/components/year-navigation';
import SearchBar from '@/components/search-bar';
import Header from '@/components/header';
import CreatePostForm from '@/components/create-post-form';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiPosts = await blogService.getAllPosts();
      setPosts(apiPosts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts from database');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setEditingPostId(post.id);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditingPostId(null);
  };

  const handlePostUpdated = () => {
    fetchPosts();
    setEditingPost(null);
    setEditingPostId(null);
  };

  // Filter posts based on search term and selected year
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(post => getYear(parseISO(post.date)) === selectedYear);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, searchTerm, selectedYear]);

  // Get unique years from posts
  const availableYears = useMemo(() => {
    const years = posts.map(post => getYear(parseISO(post.date)));
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [posts]);

  // Group posts by year for display
  const postsByYear = useMemo(() => {
    const grouped: { [year: number]: BlogPost[] } = {};
    filteredPosts.forEach(post => {
      const year = getYear(parseISO(post.date));
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    return grouped;
  }, [filteredPosts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Search and Navigation Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-white/20">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <YearNavigation 
            years={availableYears} 
            selectedYear={selectedYear} 
            onYearSelect={setSelectedYear} 
          />
        </div>

        {/* Create Post Form - Only show when not editing an existing post */}
        {!editingPostId && (
          <CreatePostForm 
            onPostCreated={fetchPosts} 
          />
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-600">Loading posts...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8"
          >
            <p className="text-yellow-800">{error}</p>
          </motion.div>
        )}

        {/* Blog Posts Section */}
        <div className="space-y-12">
          {Object.keys(postsByYear).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-500">Try adjusting your search terms or year filter.</p>
            </motion.div>
          ) : (
            Object.entries(postsByYear)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([year, yearPosts]) => (
                <motion.section
                  key={year}
                  id={`year-${year}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
                      <Calendar className="w-5 h-5" />
                      <h2 className="text-2xl font-bold">{year}</h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-purple-400"></div>
                    <span className="text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-full">
                      {yearPosts.length} {yearPosts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                  
                  <div className="grid gap-8">
                    <AnimatePresence>
                      {yearPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1 
                          }}
                        >
                          <BlogCard 
                            post={post} 
                            onEdit={handleEditPost}
                            isEditing={editingPostId === post.id}
                            onCancelEdit={handleCancelEdit}
                            onPostUpdated={handlePostUpdated}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              ))
          )}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 py-8 text-center border-t border-purple-200"
        >

          <p className="text-sm text-gray-500">
            © 2025 Muffin and Bug. A journey of fatherhood, one story at a time.
          </p>
        </motion.footer>
      </main>
    </div>
  );
}