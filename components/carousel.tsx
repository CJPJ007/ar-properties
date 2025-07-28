"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import clsx from "clsx";
import { EmblaCarouselType } from 'embla-carousel';

interface CarouselProps {
  images: string[];
  autoplay?: boolean;
  delay?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ images, autoplay = true, delay = 4000 }) => {
  const autoplayPlugin = useRef(
    Autoplay({ delay, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, autoplay ? [autoplayPlugin.current] : []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback((embla: EmblaCarouselType) => {
    setSelectedIndex(embla.selectedScrollSnap());
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollState(emblaApi);
    emblaApi.on("select", () => updateScrollState(emblaApi));
  }, [emblaApi, updateScrollState]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="min-w-full">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
        >
          <ChevronLeft />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
        >
          <ChevronRight />
        </button>
      )}

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={clsx(
              "w-3 h-3 rounded-full transition-colors",
              selectedIndex === index ? "bg-black" : "bg-gray-300"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
