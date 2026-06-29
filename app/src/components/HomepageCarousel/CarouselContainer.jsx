"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// import { VideoCard } from "@/components/VideoCard";

export default function CarouselContainer({ items, maxItems = 3.5 }) {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [itemWidth, setItemWidth] = useState(300);
  const [itemsPerView, setItemsPerView] = useState(maxItems);

  useEffect(() => {
    const updateItemWidth = () => {
      if (carouselRef.current) {
        let itemsPerPage = maxItems;
        const containerWidth = carouselRef.current.offsetWidth;
        if (window.innerWidth < 600) {
          itemsPerPage = maxItems - 2.25;
          setItemsPerView(maxItems - 2.25);
        } else if (window.innerWidth < 900) {
          itemsPerPage = maxItems - 2;
          setItemsPerView(maxItems - 2);
        } else if (window.innerWidth < 1300) {
          itemsPerPage = maxItems - 1;
          setItemsPerView(maxItems - 1);
        }

        const newItemWidth = containerWidth / itemsPerPage;

        setItemWidth(newItemWidth);
      }
    };

    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, []);

  const updateArrowVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener("scroll", updateArrowVisibility);
      return () =>
        carouselElement.removeEventListener("scroll", updateArrowVisibility);
    }
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? (-itemWidth * itemsPerView) / 1.35
          : (itemWidth * itemsPerView) / 1.35;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div className="group relative">
        <div
          ref={carouselRef}
          className="scrollbar-hide flex gap-3 space-x-1 overflow-x-scroll scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.key}
              className="flex-none"
              style={{ width: `${itemWidth}px` }}
            >
              {item}
            </div>
          ))}
        </div>

        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute bottom-0 left-0 top-0 z-10 transform bg-gray-900 bg-opacity-20 px-3 text-white opacity-0 transition-opacity duration-300 hover:bg-gray-900 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute bottom-0 right-0 top-0 z-10 transform bg-gray-900 bg-opacity-20 px-3 text-white opacity-0 transition-opacity duration-300 hover:bg-gray-900 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
