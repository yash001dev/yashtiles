'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FrameItHeader from '@/components/dashboard/FrameItHeader';
import FrameItFooter from '@/components/dashboard/FrameItFooter';
import Link from 'next/link';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  gallery?: Array<{
    image: {
      url: string;
      alt: string;
    };
    caption?: string;
  }>;
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
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // Fetch blog post
        const blogResponse = await fetch(`/api/blogs?where[slug][equals]=${slug}&status=published&populate=categories,featuredImage,gallery`);
        const blogData = await blogResponse.json();
        
        if (blogData.docs && blogData.docs.length > 0) {
          const blogPost = blogData.docs[0];
          setBlog(blogPost);
          
          // Fetch related blogs from same categories
          if (blogPost.categories && blogPost.categories.length > 0) {
            const categorySlug = blogPost.categories[0].slug;
            const relatedResponse = await fetch(`/api/blogs?where[categories.slug][equals]=${categorySlug}&where[id][not_equals]=${blogPost.id}&status=published&limit=3&populate=categories,featuredImage`);
            const relatedData = await relatedResponse.json();
            setRelatedBlogs(relatedData.docs || []);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <>
        <FrameItHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <FrameItHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blogs">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FrameItHeader />
      
      {/* Breadcrumb */}
      <nav className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-pink-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{blog.title}</span>
          </div>
        </div>
      </nav>

      {/* Blog Header */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              {/* Categories */}
              <div className="flex justify-center gap-2 mb-4">
                {blog.categories.map((category) => (
                  <span
                    key={category.slug}
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: category.color || '#ec4899' }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center justify-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(blog.publishedDate), 'MMM dd, yyyy')}
                </div>
                {blog.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {blog.readTime} min read
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? 'text-red-600 border-red-600' : ''}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mb-8"
            >
              <img
                src={blog.featuredImage.url}
                alt={blog.featuredImage.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {/* Gallery */}
                {blog.gallery && blog.gallery.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {blog.gallery.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="aspect-video rounded-lg overflow-hidden shadow-lg"
                        >
                          <img
                            src={item.image.url}
                            alt={item.image.alt}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {item.caption && (
                            <div className="p-3 bg-gray-50">
                              <p className="text-sm text-gray-600">{item.caption}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {blog.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-pink-100 hover:text-pink-700 transition-colors cursor-pointer"
                        >
                          #{tag.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-8 space-y-6">
                  {/* Share */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Share this post</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className={isLiked ? 'text-red-600 border-red-600' : ''}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Related Categories */}
                  {blog.categories.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                      <div className="space-y-2">
                        {blog.categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/blogs?category=${category.slug}`}
                            className="block px-3 py-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color || '#ec4899' }}
                            />
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Posts</h2>
                <p className="text-gray-600">More articles you might find interesting</p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog, index) => (
                  <motion.div
                    key={relatedBlog.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <BlogCard blog={relatedBlog} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <FrameItFooter />
    </>
  );
}

// Reuse BlogCard component from blog listing page
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
            {format(new Date(blog.publishedDate), 'MMM dd, yyyy')}
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