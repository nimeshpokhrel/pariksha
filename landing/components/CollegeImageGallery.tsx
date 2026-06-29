"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UploadThingImage from "./UploadThingImage";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images[0] || null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle modal navigation
  const showNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  }, [currentIndex, images]);

  const showPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  }, [currentIndex, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "Escape") setIsModalOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, showNext, showPrevious]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Scroll selected thumbnail into view
  useEffect(() => {
    if (scrollContainerRef.current && !isModalOpen) {
      const container = scrollContainerRef.current;
      const selectedThumb = container.children[currentIndex] as HTMLElement;

      if (selectedThumb) {
        const scrollLeft =
          selectedThumb.offsetLeft -
          container.offsetWidth / 2 +
          selectedThumb.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [currentIndex, isModalOpen]);

  // Handle thumbnail click
  const handleThumbnailClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Open modal with current image
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 grid grid-cols-3 gap-2">
        {images.slice(0, 2).map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-md transition-transform hover:scale-[1.02]",
              index === 0 ? "col-span-2" : "aspect-square",
            )}
            onClick={() => {
              handleThumbnailClick(image, index);
              openModal();
            }}
          >
            <UploadThingImage
              imageLink={image}
              alt={image}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex gap-2 overflow-x-auto pb-2"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2",
                currentIndex === index
                  ? "border-orange-500"
                  : "border-transparent",
              )}
              onClick={() => {
                handleThumbnailClick(image, index);
                openModal();
              }}
            >
              <UploadThingImage
                imageLink={image}
                alt={image}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute right-4 top-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              showPrevious();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
            <span className="sr-only">Previous</span>
          </Button>

          <div
            className="relative aspect-auto max-h-[80vh] max-w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage && (
              <UploadThingImage
                imageLink={selectedImage}
                alt={selectedImage}
                width={1200}
                height={800}
                className="max-h-[80vh] rounded-md object-contain"
              />
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            <ChevronRight className="h-8 w-8" />
            <span className="sr-only">Next</span>
          </Button>

          {/* Thumbnail scrollbar in modal */}
          <div className="absolute bottom-4 left-1/2 flex max-w-[90%] -translate-x-1/2 gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={image}
                className={cn(
                  "relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2",
                  currentIndex === index
                    ? "border-white"
                    : "border-transparent",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleThumbnailClick(image, index);
                }}
              >
                <UploadThingImage
                  imageLink={image}
                  alt={image}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
