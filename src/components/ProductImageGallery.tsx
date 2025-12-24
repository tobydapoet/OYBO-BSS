import { useState, useEffect, useCallback } from "react";
import type { ProductType } from "../types/Product.type";

const CompactProductGallery: React.FC<{ product: ProductType }> = ({
  product,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitionDirection, setTransitionDirection] = useState<
    "left" | "right" | "none"
  >("none");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const images = product.images.edges.map((edge) => edge.node);

  const getVisibleImages = () => {
    return [
      images[currentIndex],
      images[(currentIndex + 1) % images.length],
    ].filter(Boolean);
  };

  const visibleImages = getVisibleImages();

  const goToNext = useCallback(() => {
    if (isAnimating || images.length <= 1) return;

    setIsAnimating(true);
    setTransitionDirection("right");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsAnimating(false);
      setTransitionDirection("none");
    }, 300);
  }, [images.length, isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating || images.length <= 1) return;

    setIsAnimating(true);
    setTransitionDirection("left");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setIsAnimating(false);
      setTransitionDirection("none");
    }, 300);
  }, [images.length, isAnimating]);

  const handleThumbnailClick = (index: number): void => {
    if (isAnimating || index === currentIndex) return;

    setIsAnimating(true);
    setTransitionDirection(index > currentIndex ? "right" : "left");

    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
      setTransitionDirection("none");
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const getAnimationClass = (imageIndex: number) => {
    if (transitionDirection === "none") return "";

    if (transitionDirection === "right") {
      return imageIndex === 0
        ? "animate-slide-out-left"
        : "animate-slide-in-right";
    } else {
      return imageIndex === 0
        ? "animate-slide-out-right"
        : "animate-slide-in-left";
    }
  };

  return (
    <div>
      <div className="relative group">
        <button
          onClick={goToPrevious}
          disabled={isAnimating || images.length <= 1}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            width="30"
            height="97"
            viewBox="0 0 30 97"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.1055 96.3364L1.5 48.5244L29.1055 0.710342"
              stroke="white"
              strokeWidth="2"
            ></path>
          </svg>
        </button>

        <button
          onClick={goToNext}
          disabled={isAnimating || images.length <= 1}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            width="31"
            height="97"
            viewBox="0 0 31 97"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.39453 0.710327L29 48.5223L1.39453 96.3364"
              stroke="white"
              strokeWidth="2"
            ></path>
          </svg>
        </button>

        <div className="overflow-hidden min-h-100 w-screen md:w-210 2xl:w-260">
          <div
            className={`grid grid-cols-2 gap-px h-full ${
              isAnimating ? "pointer-events-none" : ""
            }`}
          >
            {visibleImages.map((img, idx) => (
              <div
                key={`${currentIndex}-${idx}`}
                className={`relative overflow-hidden shadow-md ${getAnimationClass(
                  idx
                )}`}
              >
                <img
                  src={img.url}
                  alt={product.title}
                  className="w-full h-175 object-cover min-h-87.5"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex overflow-x-auto gap-px p-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.slice(0, 7).map((img, idx) => {
            return (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                disabled={isAnimating}
                className={`relative shrink-0 w-24 overflow-hidden transition-all cursor-pointer ${
                  isAnimating ? "opacity-70" : ""
                }`}
                aria-label={`View image ${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : "false"}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200"
                />
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }

        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-out forwards;
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }


      `}</style>
    </div>
  );
};

export default CompactProductGallery;
