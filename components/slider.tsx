import { SliderProps } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export const Slider = ({className}:{className:string|undefined}) => {
  const [sliders, setSliders] = useState<SliderProps[]>([]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch("/api/sliders");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: SliderProps[] = await response.json();
        setSliders(data);
      } catch (error) {
        console.error("Failed to fetch sliders:", error);
      }
    };

    fetchSliders();
  }, []);

  return (
    <Carousel plugins={[Autoplay({ delay: 2000 })]}>
      <CarouselContent>
        {sliders.map((slider, index) => (
          <CarouselItem key={index} className={`${className?className:"w-full h-96 relative"}`}>
            <Image
              src={`/images/${slider.imageUrl}`}
              alt={`Slide ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-40 pointer-events-none" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
