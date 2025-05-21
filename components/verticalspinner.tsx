"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const imageURLs = [
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BBXTV4LAEedO5jo0W6YkMkVyTlmflS.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-lRbpg8oTjmaqBgWDr4lfslf9vaE6u9.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CX1AXPSpbznN7ptV0ESDhhWp3HJG9C.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-umsNhCOvityhX7YwcgZ0YerJKZD3XO.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-6Inz57rRx6BwWwDRsQO8nsSfyUVz1c.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-IPe6fFeR1w6DVZ2143Y6YCLibSOdq7.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ob5X6P6AiLzXqRjJXCOedM4RaJ3Joa.png&w=256&q=75",
];

type Props = {
  direction?: "up" | "down";
  position?: "left" | "right";
  offset?: number; // e.g., 40
};

const VerticalSpinner = ({
  direction = "up",
  position = "left",
  offset = 0,
}: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const fromY = direction === "up" ? 0 : "-50%";
    const toY = direction === "up" ? "-50%" : "0%";

    const marquee = gsap.fromTo(
      trackRef.current,
      { y: fromY },
      {
        y: toY,
        ease: "none",
        duration: 80,
        repeat: -1,
      }
    );

    return () => {
      marquee.kill();
    };
  }, [direction]);

  const positionStyle =
    position === "left" ? { left: `${offset}px` } : { right: `${offset}px` };

  return (
    <div
      className="top-0 w-40 h-screen overflow-hidden z-10"
      style={{
        ...positionStyle,
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    >
      <div ref={trackRef} className="flex flex-col gap-12">
        {[
          ...imageURLs,
          ...imageURLs,
          ...imageURLs,
          ...imageURLs,
          ...imageURLs,
          ...imageURLs,
        ].map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`icon-${idx}`}
            className="lg:w-30 lg:h-30 w-20 h-20 object-contain mx-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalSpinner;
