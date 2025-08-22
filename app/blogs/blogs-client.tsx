"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/lib/interfaces";
import { Slider } from "@/components/slider";

interface BlogsClientProps {
  blogsData: {
    data: Blog[];
    totalElements: number;
    totalPages: number;
  };
  currentPage: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function BlogsClient({ blogsData, currentPage }: BlogsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: blogs, totalElements, totalPages } = blogsData;

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      {/* <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden mt-0 md:mt-16"> */}
        <Slider className="w-full h-[300px]" showSearch={false} page="Blog" />
        {/* 
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div> */}
        {/* <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Real Estate Blog
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Insights, Tips & Market Trends
          </p>
        </motion.div> */}
      {/* </section> */}

      {/* Search Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-slate-200 focus:border-blue-500"
              />
            </div>
            <div className="text-slate-600">
              {totalElements} articles found
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredBlogs.length === 0 ? (
            <motion.div
              className="text-center py-16"
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No Blogs Found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery ? "Try adjusting your search criteria" : "Check back soon for new articles"}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Clear Search
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                ← Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                Next →
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (blog: Blog) => {
    return blog.featuredImage || `/images/${blog.thumbnailImage}` || '/placeholder.svg';
  };

  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -10 }} className="group">
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
        <div className="overflow-hidden">
          <div className="relative h-48 md:h-56">
            <Image
              src={getImageUrl(blog)}
              alt={blog.title}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              width={1200}
              height={628}
/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {blog.status === 'featured' && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Featured
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            {blog.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{blog.author.name}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          
          {blog.excerpt && (
            <p className="text-slate-600 mb-4 line-clamp-3">
              {blog.excerpt}
            </p>
          )}
          
          <Link href={`/blogs/${blog.slug}`}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105">
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
} 