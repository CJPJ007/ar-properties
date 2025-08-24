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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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
const router = useRouter();
  const handlePageChange = (page: number) => {
    router.push(`/blogs?page=${page}`);
  };

    const t = useTranslations("Blog");


  return (
<div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-slate-900 dark:to-gray-900 pb-16 md:pb-0 text-slate-900 dark:text-white">
  <Header />

  {/* Hero Section */}
  <Slider className="w-full h-[220px] md:h-[300px]" showSearch={false} page="Blog" />

  {/* Search Section */}
  <section className="py-8 bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-gray-300 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
          />
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          {t("search.results", { count: totalElements })}
        </div>
      </div>
    </div>
  </section>

  {/* Blogs Grid */}
  <section className="py-16 px-4">
    <div className="max-w-7xl mx-auto">
      {filteredBlogs.length === 0 ? (
        <motion.div className="text-center py-16" transition={{ duration: 0.6 }}>
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold mb-2">{t("noBlogs.title")}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery ? t("noBlogs.trySearch") : t("noBlogs.checkBack")}
          </p>
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {t("noBlogs.clearSearch")}
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
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white hover:border-blue-500"
          >
            ← {t("pagination.prev")}
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
                  className={`w-10 h-10 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white hover:border-blue-500"
                  }`}
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
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white hover:border-blue-500"
          >
            {t("pagination.next")} →
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
  <motion.div
  variants={fadeInUp}
  whileHover={{ y: -10 }}
  className="group"
>
  <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
    <div className="overflow-hidden relative">
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

      {blog.status === "featured" && (
        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          Featured
        </Badge>
      )}
    </div>

    <CardContent className="p-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-400" />
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
        {blog.author && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-400" />
            <span>{blog.author.name}</span>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
        {blog.title}
      </h3>

      {blog.excerpt && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
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