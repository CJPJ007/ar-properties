"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Clock,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/lib/interfaces";

interface BlogDetailClientProps {
  blog: Blog;
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog.title;
    const text = blog.excerpt || blog.title;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setShowShareMenu(false);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const getImageUrl = () => {
    return blog.featuredImage || `/images/${blog.thumbnailImage}` || '/placeholder.svg';
  };

  return (
<div className="min-h-screen bg-gray-900 pb-16 md:pb-0">
  <Header />

  {/* Back Button */}
  <div className="pt-20 md:pt-24 px-4">
    <div className="max-w-4xl mx-auto">
      <Link href="/blogs">
        <Button variant="outline" className="mb-6 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-gray-500">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Button>
      </Link>
    </div>
  </div>

  {/* Blog Header */}
  <section className="px-4 mb-8">
    <div className="max-w-4xl mx-auto">
      <motion.div {...fadeInUp}>
        {/* Featured Image */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={getImageUrl()}
            alt={blog.title}
            width={1200}
            height={628}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Share Button */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <Button
                onClick={() => setShowShareMenu(!showShareMenu)}
                variant="ghost"
                size="sm"
                className="bg-gray-800/50 text-white hover:bg-gray-700/60"
              >
                <Share2 className="w-5 h-5" />
              </Button>

              {showShareMenu && (
                <div className="absolute right-0 top-12 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 min-w-[200px] z-10 text-gray-200">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-700 rounded text-left"
                  >
                    <Facebook className="w-4 h-4 text-blue-500" />
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-700 rounded text-left"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-700 rounded text-left"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-700 rounded text-left"
                  >
                    <Share2 className="w-4 h-4 text-gray-300" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          {blog.status === 'featured' && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Featured
            </Badge>
          )}
        </div>

        {/* Blog Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{getReadingTime(blog.content)} min read</span>
          </div>
          {blog.author && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={blog.author.avatar} />
                <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>By {blog.author.name}</span>
            </div>
          )}
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Blog Excerpt */}
        {blog.excerpt && (
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
        )}
      </motion.div>
    </div>
  </section>

  {/* Blog Content */}
  <section className="px-4 mb-12">
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <div
                  className="prose dark:text-white prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white prose-blockquote:border-l-blue-400 prose-blockquote:bg-gray-800 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            {/* Author Card */}
            {blog.author && (
              <Card className="mb-6 bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={blog.author.avatar} />
                      <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{blog.author.name}</p>
                      <p className="text-sm text-gray-400">{blog.author.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Article Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Article Info</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Published</span>
                    <span className="font-medium">{formatDate(blog.publishedAt || blog.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading Time</span>
                    <span className="font-medium">{getReadingTime(blog.content)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

  );
} 