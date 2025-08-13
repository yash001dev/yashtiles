'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import Link from 'next/link';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  categories: Array<{
    name: string;
    slug: string;
    color?: string;
  }>;
  tags: Array<{
    tag: string;
  }>;
  author: string;
  publishedDate: string;
  readTime?: number;
  status: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch blogs and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams({
          status: 'published',
          limit: '12',
          page: currentPage.toString(),
          populate: 'categories,featuredImage',
          sort: '-publishedDate',
        });

        if (selectedCategory !== 'all') {
          params.append('where[categories.slug][equals]', selectedCategory);
        }

        if (searchQuery) {
          params.append('where[or][0][title][contains]', searchQuery);
          params.append('where[or][1][excerpt][contains]', searchQuery);
        }

        // Fetch blogs
        const blogsResponse = await fetch(`/api/blogs?${params.toString()}`);
        const blogsData = await blogsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/blog-categories?status=active&sort=sortOrder');
        const categoriesData = await categoriesResponse.json();
        
        setBlogs(blogsData.docs || []);
        setTotalPages(blogsData.totalPages || 1);
        setCategories(categoriesData.docs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchQuery, currentPage]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (loading && blogs.length === 0) {
    return (
      <>
        <FrameItHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FrameItHeader />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Frame Care & Design Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tips, design inspiration, and everything you need to know about framing
            </p>
          </motion.div>

          {/* Search and Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.slug ? 
                      (category.color || '#ec4899') : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                Showing {blogs.length} post{blogs.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === index + 1
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {blogs.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or category filter
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <FrameItFooter />
    </>
  );
}

// Blog Card Component
function BlogCard({ blog }: { blog: Blog }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={blog.featuredImage.url}
          alt={blog.featuredImage.alt}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Category Badge */}
        {blog.categories.length > 0 && (
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: blog.categories[0].color || '#ec4899' }}
            >
              {blog.categories[0].name}
            </span>
          </div>
        )}

        {/* Read Time */}
        {blog.readTime && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
            {blog.readTime} min read
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(blog.publishedDate)}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {blog.author}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-pink-600 transition-colors">
          <Link href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag.tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Read More */}
        <Link href={`/blogs/${blog.slug}`}>
          <motion.div
            className="flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors"
            whileHover={{ x: 5 }}
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </div>
    </motion.article>
  );
}

function formatDate(dateString: string) {
  return format(new Date(dateString), 'MMM dd, yyyy');
}