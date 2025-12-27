import { useState, useEffect } from "react";

const RotatingBanner = () => {
  const banners = [
    {
      id: 1,
      bgClass: "bg-black",
      textClass: "text-white",
    },
    {
      id: 2,
      bgClass: "bg-pink-300",
      textClass: "text-white",
    },
    {
      id: 3,
      bgClass: "bg-amber-800",
      textClass: "text-white",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayBanner, setDisplayBanner] = useState(banners[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % banners.length;
        setDisplayBanner(banners[nextIndex]);
        setCurrentIndex(nextIndex);

        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  return (
    <div className="relative h-14 overflow-hidden">
      <div
        className={`${displayBanner.bgClass} ${displayBanner.textClass} 
          py-4 px-4 text-center text-sm w-full h-full
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${
            isAnimating
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
      >
        {/* {displayBanner.content} */}
      </div>
    </div>
  );
};

export default RotatingBanner;
