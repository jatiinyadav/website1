"use client";

import { gsap } from "gsap";
import { useState } from "react";

type Props = {
  setShowGame?: (val: boolean) => void;
  setGameHeader?: (val: string) => void;
  setGameDescription?: (val: string) => void;
  gap?: boolean;
  selected?: string;
};

const Buttons: React.FC<Props> = ({
  setShowGame,
  setGameHeader,
  setGameDescription,
  gap = true,
  selected = "",
}) => {
  const [showGap, setShowGap] = useState(gap);
  const [selectedGenre, setSelectedGenre] = useState<string>(selected);

  const gamePrompts: Record<string, string> = {
    Cars: "Which is pricier? Tap it.",
    Fruits: "Sweetest fruit? Tap it.",
    Animals: "Lives longest? Tap it.",
    Cities: "Most populated? Tap it.",
    Food: "Highest calories? Tap it.",
  };
  
  const animateButtons = (genre: string) => {
    if (!selectedGenre) {
      setShowGap(false);
      const targetY = window.innerHeight * -0.9; // Move up to 10% from top

      // Animate buttons to move up and join together
      const tl = gsap.timeline({
        onComplete: () => {
          // Trigger your logic after animation completes
          showGame(genre);
        },
      });

      // Step 1: Remove border-radius and spacing
      tl.to(".genre-button", {
        duration: 0.3,
        borderRadius: 0,
        margin: 0,
        padding: "8px 26px", // optional tighter padding
        stagger: 0.05,
      });

      // Step 2: Animate upward and combine
      tl.to(".genre-button", {
        duration: 0.5,
        y: "-60vh",
        ease: "power2.inOut",
        stagger: 0.05,
      });
    } else {
      setSelectedGenre(genre);
      showGame(genre);
    }
  };

  const showGame = (genre: string) => {
    setShowGame?.(true);
    setGameHeader?.(genre);
    setGameDescription?.(gamePrompts[genre] || "Make your choice! Tap on it.");
  };

  return (
    <>
      <div
        className={`flex flex-wrap justify-center ${
          showGap ? "gap-4 sm:gap-6 md:gap-10" : "gap-0"
        } description`}
      >
        {Object.keys(gamePrompts).map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => animateButtons(genre)}
            className={`genre-button border-2 border-gray-900 text-sm sm:text-base md:text-md px-6 sm:px-8 py-2 sm:py-2.5 cursor-pointer
        ${
          selectedGenre === genre
            ? "bg-white text-black"
            : "bg-[#fff8e6] text-gray-900"
        }
      `}
          >
            {genre}
          </button>
        ))}
      </div>
    </>
  );
};

export default Buttons;
