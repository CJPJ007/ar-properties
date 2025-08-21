"use client";

import type { Property, SliderProps } from "@/lib/interfaces";
import { useEffect, useRef, useState } from "react"; // ⬅️ add useRef
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

export const Slider = ({
  className,
  showSearch,
  page
}: {
  className: string | undefined;
  showSearch: boolean;
  page?: string; // Optional prop for page context
}) => {
  const [sliders, setSliders] = useState<SliderProps[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Property[]>([]);

  // ✅ Create ONE Autoplay instance and keep it stable
  const autoplayRef = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false, // we will control pause ourselves
      stopOnMouseEnter: false,  // optional: don’t pause on hover
    })
  );

  // ✅ Keep a single resume timer
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch(`/api/sliders?page=${page || "Home"}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data: SliderProps[] = await response.json();
        setSliders(data);
      } catch (error) {
        console.error("Failed to fetch sliders:", error);
      }
    };
    fetchSliders();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    // Cleanup resume timer on unmount
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`/api/properties/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error("Error searching properties:", error);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // 🔁 Helper: pause then resume after N ms
  const pauseAndResumeAutoplay = (ms = 8000) => {
    // stop now
    autoplayRef.current.stop();

    // clear any prior resume timer
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    // resume later (reset restarts the timer with the plugin’s delay)
    resumeTimerRef.current = setTimeout(() => {
      autoplayRef.current.reset(); // or: autoplayRef.current.play()
    }, ms);
  };

  return (
    <section
      className={`relative ${className ? className : "w-full h-96 bg-gradient-to-r from-blue-600 to-yellow-400"} flex items-center justify-center overflow-hidden mt-16`}
    >
      <div className="absolute inset-0 z-0">
        <div className={`relative w-full h-full`}>
          <Carousel
            setApi={setApi}
            // ⬇️ Use the stable plugin instance
            plugins={[autoplayRef.current]}
            className="w-full h-full"
          >
            <CarouselContent className="w-full h-full">
              {sliders.map((slider, index) => (
                <CarouselItem className="relative w-full h-full bg-gradient-to-r from-blue-600 to-yellow-400">
  <Image
    src={`/images/${slider.imageUrl}`}
    alt={slider.altText || `Slide ${index + 1}`}
    fill
    className="object-cover h-full w-full bg-black" // or object-cover if you prefer full-bleed
    priority={index === 0}
  />
</CarouselItem>

              ))}
            </CarouselContent>
          </Carousel>

          {/* Dynamic Title / Subtitle */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {sliders[current] && (
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <motion.h1
                      className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      {sliders[current].title}
                    </motion.h1>
                    <motion.p
                      className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {sliders[current].subtitle}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {sliders.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => {
                  api?.scrollTo(index);
                  pauseAndResumeAutoplay(8000); // ⏸️ pause then ▶️ resume after 8s
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {showSearch && (
        <motion.div
          className="absolute inset-0 z-10 text-center text-white px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 450 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Search Bar */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search properties by city or zip code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 text-slate-800 placeholder:text-slate-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="h-12 px-6 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Clear
              </Button>
            )}
          </motion.div>

          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                className="grid relative grid-cols-1 gap-6 max-w-6xl mx-auto my-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-h-[400px] overflow-y-auto border rounded-lg bg-white/80 shadow p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                  {searchResults.map((property) => {
                    const regex = new RegExp(`(${searchQuery})`, "ig");
                    const parts = property.title.split(regex);
                    const locationParts = property.location.split(regex);
                    const pinCodeParts = property.pinCode.toString().split(regex);
                    const typeParts = property.type.split(regex);
                    return (
                      <div
                        key={property.id}
                        className="flex items-center justify-between gap-4 border-b last:border-b-0 py-2"
                      >
                        <div className="flex gap-2 min-w-0 text-sm ">
                          <span className="font-medium text-slate-800 truncate">
                            Title:{" "}
                            {parts.map((part, i) =>
                              regex.test(part) ? (
                                <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">
                                  {part}
                                </mark>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </span>
                          <span className="font-medium text-slate-800 truncate">
                            Location:{" "}
                            {locationParts.map((part, i) =>
                              regex.test(part) ? (
                                <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">
                                  {part}
                                </mark>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </span>
                          <span className="font-medium text-slate-800 truncate">
                            Pincode:{" "}
                            {pinCodeParts.map((part, i) =>
                              regex.test(part) ? (
                                <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">
                                  {part}
                                </mark>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </span>
                          <span className="font-medium text-slate-800 truncate">
                            Type:{" "}
                            {typeParts.map((part, i) =>
                              regex.test(part) ? (
                                <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">
                                  {part}
                                </mark>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </span>
                          <span className="text-amber-600 font-semibold">{property.price} INR</span>
                        </div>
                        <Link href={`/properties/${property.slug}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {searchResults.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                onClick={() =>
                  document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Properties
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
};
