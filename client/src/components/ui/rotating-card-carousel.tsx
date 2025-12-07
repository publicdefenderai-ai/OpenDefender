import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface RotatingCardCarouselProps {
  items: CarouselItem[];
  autoRotateInterval?: number;
}

export function RotatingCardCarousel({ 
  items, 
  autoRotateInterval = 4000 
}: RotatingCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [items.length, autoRotateInterval]);

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 45 : -45,
      opacity: 0,
      scale: 0.8,
      z: -100,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -45 : 45,
      opacity: 0,
      scale: 0.8,
      z: -100,
    }),
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" style={{ perspective: "1000px" }}>
      <div className="relative min-h-[170px] flex flex-col justify-center pb-2">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="bg-card border border-border/50 rounded-2xl px-6 py-5 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center text-primary ring-1 ring-primary/20">
                  {items[currentIndex].icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">
                    {items[currentIndex].title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {items[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2.5 mt-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-6"
                : "w-2 bg-muted-foreground/20 ring-1 ring-border hover:bg-muted-foreground/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
