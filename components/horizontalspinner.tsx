"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const imageURLs = [
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BBXTV4LAEedO5jo0W6YkMkVyTlmflS.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-lRbpg8oTjmaqBgWDr4lfslf9vaE6u9.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CX1AXPSpbznN7ptV0ESDhhWp3HJG9C.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-T3qYlSLKV0Nh0PeSRW3YIPVgA0Mkqy.png&w=160&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-8lOyrhQlGSIJTUcvjOAKuk8EGEYnAL.png&w=160&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-lJtgyMsZAMhsOQy6TgetNuRXs9wjhj.png&w=160&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-IF5eoJ5yDHH05GM6Qrdt6GwG0wWQhy.png&w=160&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-umsNhCOvityhX7YwcgZ0YerJKZD3XO.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-6Inz57rRx6BwWwDRsQO8nsSfyUVz1c.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-oBUVWdbvHSxep2I7h2FU5nLccpdClO.png&w=160&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-15cY68NLXaIbAjN5zcdSidVPjWn4fw.png&w=160&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-IPe6fFeR1w6DVZ2143Y6YCLibSOdq7.png&w=256&q=75",
  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ob5X6P6AiLzXqRjJXCOedM4RaJ3Joa.png&w=256&q=75",
];

type Props = {
  direction?: "left" | "right"; // Changed from up/down to left/right
  position?: "top" | "bottom"; // Optional, but we now move horizontally
  offset?: number;
};

const HorizontalSpinner = ({
  direction = "left",
  position = "top",
  offset = 0,
}: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const fromX = direction === "left" ? 0 : "-50%";
    const toX = direction === "left" ? "-50%" : "0%";

    const marquee = gsap.fromTo(
      trackRef.current,
      { x: fromX },
      {
        x: toX,
        ease: "none",
        duration: 10,
        repeat: -1,
      }
    );

    return () => {
      marquee.kill();
    };
  }, [direction]);

  const positionStyle =
    position === "top" ? { top: `${offset}px` } : { bottom: `${offset}px` };

  return (
    <div
      className="left-0 w-screen h-40 overflow-hidden z-10 absolute"
      style={{
        ...positionStyle,
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    >
      <div ref={trackRef} className="flex flex-row gap-12">
        {[...imageURLs, ...imageURLs, ...imageURLs].map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`icon-${idx}`}
            className="lg:w-30 lg:h-30 w-20 h-20 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalSpinner;
