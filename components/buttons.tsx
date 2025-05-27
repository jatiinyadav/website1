"use client";

type Props = {
  setShowGame: (val: boolean) => void;
  setGameHeader: (val: string) => void;
  setGameDescription: (val: string) => void;
};

const Buttons: React.FC<Props> = ({
  setShowGame,
  setGameHeader,
  setGameDescription,
}) => {
  const gamePrompts: Record<string, string> = {
    Cars: "Which one is more expensive? Tap on it.",
    Sports: "Which athlete has more titles? Tap on it.",
    Movie: "Which movie has a higher IMDb rating? Tap on it.",
    Hollywood: "Which Hollywood star is more popular? Tap on it.",
    Bollywood: "Which Bollywood actor charges more? Tap on it.",
  };

  const showGame = (genre: string) => {
    setShowGame(true);
    setGameHeader(genre);
    setGameDescription(gamePrompts[genre] || "Make your choice! Tap on it.");
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 description">
        {Object.keys(gamePrompts).map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => showGame(genre)}
            className="text-gray-900 bg-[#fff8e6] border-2 border-gray-900 text-sm sm:text-base md:text-md rounded-lg px-6 sm:px-8 py-2 sm:py-2.5 cursor-pointer"
          >
            {genre}
          </button>
        ))}
      </div>
    </>
  );
};

export default Buttons;
