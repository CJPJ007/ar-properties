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
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
  // Re-render UI on screen size change
  const [, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Set initial size

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <section
      className={`relative ${className ? className : "w-full h-96 bg-gradient-to-r from-blue-600 to-yellow-400"} flex items-center justify-center overflow-hidden mt-14 md:mt-[6.5rem]`}
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
                  <div className="relative w-full h-full">
  {/* Background blurred layer */}
  <Image
    src={
      isMobile && slider.mobileImageUrl
        ? `/images/${slider.mobileImageUrl}`
        : `/images/${slider.imageUrl}`
    }
    alt=""
    fill
    className="object-cover blur-2xl scale-110 opacity-40"
    aria-hidden="true"
  />

  {/* Main image */}
  <Image
    src={
      isMobile && slider.mobileImageUrl
        ? `/images/${slider.mobileImageUrl}`
        : `/images/${slider.imageUrl}`
    }
    alt={slider.altText || ""}
    fill
    className="object-contain relative z-10"
    sizes="(max-width: 768px) 100vw, 100vw"
  />
</div>

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

     
    </section>
  );
};
