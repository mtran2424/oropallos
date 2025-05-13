"use client"
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";

// Gallery Images
import CansAisle from "@/components/assets/photos/cans-aisle.jpg";
import RecipeDisplay from "@/components/assets/photos/recipe-display.jpg";
import ChampageShelf from "@/components/assets/photos/champagne-shelf.jpg";
import RtdShelf from "@/components/assets/photos/rtd-shelf.jpg";
import WesTasting from "@/components/assets/photos/wes-tasting.png";

const slides = [
  {
    title: "Cans, cans, cans!",
    description: "Look at all these cans! We have a huge selection of Ready-to-drink canned beverages. Some may even be chilling in our coolers and ready to go!",
    image: CansAisle,
    button: "",
    alt: "Ready-to-drink canned beverages aisle",
  },
  {
    title: "Got Margs?",
    description: "Any day is a good day for a cocktail! We have a colorful variety of mixes and Ready-to-drink cocktails and margaritas right when you walk in.",
    image: RtdShelf,
    alt: "Ready-to-drink cocktails and margaritas",
  },
  {
    title: "Largest Recipe 21 Stock in the Area",
    description: "Need to restock your bar bottles? Our Recipe 21 selection is unmatched in the wider area.",
    image: RecipeDisplay,
    alt: "Recipe 21 display",
  },
  {
    title: "Perfect for Celebrations",
    description: "Whether it\'s a birthday, wedding, or any special occasion, we have the perfect drink for you. We have bubbles, and high end spirits to make your celebration unforgettable.",
    image: ChampageShelf,
    alt: "Champagne and sparkling wine display",
  },
  {
    title: "Free Tastings Most Weekends",
    description: "Join us for free tastings most weekends! Sample a variety of wines and spirits and find your new favorite drink. We want you to try everything!",
    image: WesTasting,
    alt: "Liquor tasting event",
  },
  // {
  //   title: "",
  //   description: "",
  //   image: "",
  //   alt: "",
  // },
  // {
  //   title: "",
  //   description: "",
  //   image: "",
  //   alt: "",
  // },
]
const HomeGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    renderMode: "performance",
    defaultAnimation: {
      duration: 300, // transition duration in milliseconds
      easing: (t) => t, // linear easing (or customize)
    },
  });

  return (
    <div className="relative bg-zinc-800 w-full">
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide relative h-[70vh] w-screen"
          >
            {/* Background Image */}
            <div className="relative w-full h-full overflow-hidden group">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.alt || ""}
                fill
                className="object-cover object-center transform scale-110 group-hover:scale-100 transition-transform duration-700 ease-out z-0"
                priority
              />
            </div>
            {/* Optional overlay for contrast */}
            {/* <div className="absolute inset-0 bg-black/30 z-10" /> */}

            {/* Content Container */}
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                key={index}
                className="absolute bottom-0 z-20 flex flex-col items-center w-full font-serif"
              >
                {/* Gradient Background */}
                <div className="absolute bottom-0 w-full h-full z-[-1] bg-gradient-to-t from-black/80 to-transparent"></div>

                <div className="text-zinc-300 p-8 w-full">
                  <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">{slide.title}</h2>
                  <p className="mb-6 text-2xl">{slide.description}</p>
                  {slide.button && (
                    <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
                      {slide.button}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}

        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-0 h-full w-1/4 text-white p-5 cursor-pointer"
        >
          {/* <CiSquareChevLeft size={40} /> */}
        </button>

        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-0 h-full w-1/4 text-white p-5 cursor-pointer"
        >
          {/* <CiSquareChevRight size={40} /> */}
        </button>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => instanceRef.current?.moveToIdx(i)}
              className={`h-3 w-3 rounded-full ${currentSlide === i ? "bg-white" : "bg-gray-500"}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default HomeGallery;