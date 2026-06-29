"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const testimonials = [
  {
    id: 5,
    name: "Deepak Bhattarai",
    college: "Patan Multiple Campus, Bsc. CSIT",
    quote:
      "Pariksha played a big role in my entrance preparation journey. The focused guidance, regular mock tests, and expert teaching helped me secure a good rank in my entrance exam. I truly thank the entire team for their support!",

    rank: 22,
  },
  {
    id: 4,
    name: "Bishal Banjara",
    college: "ASCOL Campus, Bsc. CSIT",
    quote:
      "Pariksha made my exam prep stress-free and fun. The clear lessons, free study materials, and regular mock tests gave me the confidence I needed. I’m so grateful for this free platform and its amazing team!",

    rank: 41,
  },
  {
    id: 1,
    name: "Prajwal Pathak",
    college: "Mechi Multiple Campus, Bsc. CSIT",
    quote:
      "This platform made entrance preparation so easy and effective. The notes, videos, and mock tests really helped me understand the topics well. I'm thankful for the support and highly recommend it to others.",
  },
  {
    id: 3,
    name: "Unish Rai",
    college: "Patan Multiple Campus, BIT",
    quote:
      "I found Pariksha just in time for my entrance exams. The easy-to-follow notes, helpful videos, and free practice tests helped me master tough topics. Thank you, Pariksha, for all your support!",

    rank: 188,
  },
  {
    id: 2,
    name: "Nitesh Ghimire",
    college: "Mechi Multiple Campus, Bsc. CSIT",
    quote:
      "Using Pariksha was the best choice for my exam prep. The structured plan, free resources, and friendly teachers kept me motivated. I highly recommend this free platform to every student!",

    rank: 345,
  },
  {
    id: 6,
    name: "Rohit Sujakhu",
    college: "Bhaktapur Multiple Campus, Bsc. CSIT",
    quote:
      "Pariksha turned my worries into wins. The simple notes, step-by-step videos, and free quizzes made studying effective and enjoyable. Big thanks to the Pariksha team for guiding me to success!",
  },
];

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  className?: string;
}

function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card className={cn("h-full border shadow-sm", className)}>
      <CardContent className="relative flex h-full flex-col p-6">
        {testimonial.rank && (
          <Badge
            variant="outline"
            className={`absolute right-2 top-2 bg-emerald-50 text-xs text-emerald-700`}
          >
            Rank: {testimonial.rank}
          </Badge>
        )}
        <div className="mb-4 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                `/images/testimonials/${testimonial.name.split(" ").join("-")}.jpeg` ||
                "/placeholder.svg"
              }
              alt={testimonial.name}
            />
            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.college}
            </p>
          </div>
        </div>

        <blockquote className="flex-1 text-base italic">
          {`"${testimonial.quote}"`}
        </blockquote>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const AUTO_SCROLL_INTERVAL = 4000;
  const RESUME_AFTER = 2000;

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    autoScrollTimerRef.current = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, AUTO_SCROLL_INTERVAL);
  }, [api]);

  const stopAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  };

  const resetAutoScrollTimer = useCallback(() => {
    stopAutoScroll();
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    pauseTimerRef.current = setTimeout(() => {
      if (isVisible) startAutoScroll(); // Only resume if visible
    }, RESUME_AFTER);
  }, [startAutoScroll, isVisible]);

  const handleDotClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
    resetAutoScrollTimer();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      },
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      resetAutoScrollTimer();
    };

    api.on("select", onSelect);

    if (isVisible) {
      startAutoScroll();
    }

    return () => {
      api.off("select", onSelect);
      stopAutoScroll();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [api, isVisible, resetAutoScrollTimer, startAutoScroll]);

  return (
    <div ref={containerRef}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: false,
          skipSnaps: false,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <TestimonialCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              current === index
                ? "bg-primary shadow-sm"
                : "bg-slate-300 hover:bg-primary-30"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to testimonial group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
