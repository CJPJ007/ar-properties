"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ChatBot from "@/components/chatbot";
import Link from "next/link";
// import { Carousel } from "@/components/carousel";
import Image from "next/image";
import { Property } from "@/lib/interfaces";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Slider } from "@/components/slider";

const fadeInUp = {
  // initial: { opacity: 0, y: 60 },
  // animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  
  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterAndSortProperties();
  }, [properties, searchQuery, selectedType, sortBy]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties",{
        method:"POST"
      });
      const data = await response.json();
      setProperties(data.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((property) => property.type === selectedType);
    }

    // Sort properties
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            a.price -
            b.price
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            a.price -
            b.price
        );
        break;
      case "beds":
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProperties(filtered);
  };

  const propertyTypes = ["all", "house", "condo", "townhouse", "luxury"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-0 md:mt-16">
        <div className="absolute inset-0 z-0">
          <Slider />
        </div>

        <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Explore Our Properties
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Discover your dream home with Ananta Realty's curated selection
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-slate-200 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 h-12 bg-white border-slate-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all"
                        ? "All Types"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12 bg-white border-slate-200">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="beds">Most Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Available Properties
            </h2>
            <p className="text-lg text-slate-600">
              {filteredProperties.length} properties found
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              className="text-center py-16"
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No Properties Found
              </h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSortBy("featured");
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/**<AnimatePresence>**/}
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              {/**</AnimatePresence>**/}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
}



function PropertyCard({ property }: { property: Property }) {
  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -10, rotateX: 5, rotateY: 5 }} className="group">
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
        <div className="overflow-hidden">
          <Image
            src={`/images/${property.thumbnailImage}` || "/placeholder.svg"}
            alt={property.title}
            width={640}
            height={64}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {property.featured && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-2xl font-bold text-amber-600 mb-3">{property.price} INR</p>
          <div className="flex items-center gap-4 text-slate-600 mb-4">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.areaSqft} sqft</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
          </div>
<Link href={`/property/${property.id}`}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-64" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-8 w-1/2 mb-3" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
