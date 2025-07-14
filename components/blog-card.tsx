'use client';

import { BlogPost } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { Calendar, Tag, Star, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PhotoCarousel from './photo-carousel';
import { useState } from 'react';

import CreatePostForm from './create-post-form';

interface BlogCardProps {
  post: BlogPost;
  onEdit?: (post: BlogPost) => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  onPostUpdated?: () => void;
}

export default function BlogCard({ post, onEdit, isEditing, onCancelEdit, onPostUpdated }: BlogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count words in content
  const wordCount = post.content.split(/\s+/).filter(word => word.length > 0).length;
  const shouldShowExpandCollapse = wordCount > 150;

  // Split content into words and create truncated version
  const words = post.content.split(/\s+/);
  const truncatedContent = words.slice(0, 150).join(' ');
  const displayedContent = isExpanded ? post.content : (shouldShowExpandCollapse ? truncatedContent + '...' : post.content);

  return (
    <div>
      {/* Inline Edit Form */}
      {isEditing && (
        <div className="mb-6">
          <CreatePostForm 
            editingPost={post}
            onCancelEdit={onCancelEdit}
            onPostCreated={onPostUpdated}
          />
        </div>
      )}
      
      {/* Blog Post Card */}
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 ${
          post.featured 
            ? 'ring-2 ring-purple-200 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white' 
            : 'border-gray-100'
        }`}
      >
        <div className="p-4 sm:p-6 md:p-8 relative">
          {/* Floating Image in top-right with text wrapping */}
          {post.image && (
            <div className="float-right ml-4 mb-4 lg:ml-6 lg:mb-6 w-[200px] sm:w-[250px] md:w-[300px]">
              <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                {post.featured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Featured
                  </motion.div>
                )}
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(post);
                    }}
                    className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-gray-700 p-1.5 rounded-full shadow-lg transition-all duration-200"
                  >
                    <Edit className="w-3 h-3" />
                  </motion.button>
                )}
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Content that wraps around the image */}
          <div className="relative z-10">
            {/* Date and Edit Button Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {format(parseISO(post.date), 'MMMM d, yyyy')}
                  </time>
                </div>
              </div>
              {onEdit && !post.image && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(post)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              )}
            </div>
            
            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight hover:text-pink-600 transition-colors cursor-pointer">
              {post.title}
            </h2>
            
            {/* Excerpt - only show if exists */}
            {post.excerpt && post.excerpt.trim() && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Full content */}
            <div className="prose prose-lg max-w-none mb-6 text-gray-700 leading-relaxed">
              {displayedContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
              {!isExpanded && shouldShowExpandCollapse && (
                <div className="text-gray-400 text-sm italic">
                  {wordCount - 150} more words
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery - Full width below main content */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-6 clear-both">
              <PhotoCarousel 
                images={post.gallery} 
                title={post.title} 
                isCollapsed={!isExpanded && shouldShowExpandCollapse}
              />
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 mt-6 clear-both">
            {post.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Read Full Story Button */}
          {shouldShowExpandCollapse && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 clear-both"
            >
              {isExpanded ? 'Show Less' : 'Read Full Story'}
            </motion.button>
          )}
        </div>
      </motion.article>
    </div>
  );
}