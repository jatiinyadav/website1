import Image from "next/image";
import { useEffect, useState } from "react";
import GameOverModal from "./gameover";
import StreakCounter from "./streak";

type Comparison = {
  name: string;
  price: number;
  url: string;
  shown?: boolean;
};

type Header = {
  heading: string;
  description: string;
};

type StreakCounterProps = {
  dataForComparison: Comparison[];
  header: Header;
};

const Game: React.FC<StreakCounterProps> = ({ dataForComparison, header }) => {
  const [loaded, setLoaded] = useState(false);
  const [leftOption, setLeftOption] = useState<Comparison>();
  const [rightOption, setRightOption] = useState<Comparison>();
  const [borderColor, setBorderColor] = useState({
    leftOptionBorder: "",
    rightOptionBorder: "",
  });
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [comparison, setComparison] = useState<Comparison[]>(dataForComparison);

  useEffect(() => {
    const [a, b] = getTwoRandomOptions(comparison);
    setLeftOption(a);
    setRightOption(b);

    console.log(leftOption);
    console.log(b);
  }, []);

  const handleSelection = (side: "left" | "right") => {
    if (!leftOption || !rightOption) return;

    // Check if selected option is correct
    const selectedCar = side === "left" ? leftOption : rightOption;
    const otherCar = side === "left" ? rightOption : leftOption;
    const isCorrect = selectedCar.price >= otherCar.price;

    console.log(leftOption);
    console.log(rightOption);
    console.log(isCorrect);

    // Set border color
    setBorderColor({
      leftOptionBorder:
        side === "left"
          ? isCorrect
            ? "border-green-500"
            : "border-red-500"
          : "border-transparent",
      rightOptionBorder:
        side === "right"
          ? isCorrect
            ? "border-green-500"
            : "border-red-500"
          : "border-transparent",
    });

    // If wrong, end game after delay
    if (!isCorrect) {
      setTimeout(() => setGameOver(true), 300);
      setStreak(0);
      return;
    }

    // Mark both the options as shown
    const updatedData = comparison.map((c: Comparison) =>
      c.name === leftOption.name || c.name === rightOption.name
        ? { ...c, shown: true }
        : c
    );
    setComparison(updatedData);

    // Update streak counter
    setStreak((prev) => prev + 1);

    // Find a new comparsion
    const newComparison = updatedData.find(
      (c) => !c.shown && c.name !== selectedCar.name
    );

    // If no new comparsion is left
    if (!newComparison) {
      setTimeout(() => setGameOver(true), 1000);
      return;
    }

    // Replace the incorrect car with new one
    setTimeout(() => {
      if (side === "left") {
        setLeftOption(newComparison);
      } else {
        setRightOption(newComparison);
      }

      setBorderColor({ leftOptionBorder: "", rightOptionBorder: "" });
    }, 500);
  };

  const restartGame = () => {
    setStreak(0);
    setGameOver(false);
    setBorderColor({ leftOptionBorder: "", rightOptionBorder: "" });
    const initialized = comparison.map((c: Comparison) => ({
      ...c,
      shown: false,
    }));
    setComparison(initialized);
    const [a, b] = getTwoRandomOptions(initialized);
    setLeftOption(a);
    setRightOption(b);
  };

  const getTwoRandomOptions = (comparison: Comparison[]) => {
    const unshown = comparison.filter((c) => !c.shown);
    const shuffled = [...unshown].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  };

  return (
    <>
      <div className="relative min-h-screen bg">
        <h1 className="text-6xl text-center pt-10 hero text-black">
          {header.heading}
        </h1>
        <h1 className="text-4xl text-center pt-5 description text-bold text-black">
          {header.description}
        </h1>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-14">
          <div className="flex h-180 w-380 z-20">
            <StreakCounter count={streak} />
            {leftOption && (
              <div
                className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 ${
                  borderColor.leftOptionBorder
                    ? borderColor.leftOptionBorder
                    : "hover:border-black border-transparent"
                }`}
                style={{ marginRight: "-0.3rem" }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={leftOption.url}
                    alt={leftOption.name}
                    fill
                    onLoadingComplete={() => setLoaded(true)}
                    onClick={() => handleSelection("left")}
                    className={`object-cover brightness-40 transition-opacity duration-700 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-white text-5xl font-bold hero ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {leftOption.name}
                </div>
              </div>
            )}

            {rightOption && (
              <div
                className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 ${
                  borderColor.rightOptionBorder
                    ? borderColor.rightOptionBorder
                    : "hover:border-black border-transparent"
                }`}
                style={{ marginLeft: "-0.3rem" }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={rightOption.url}
                    alt={rightOption.name}
                    fill
                    onClick={() => handleSelection("right")}
                    onLoadingComplete={() => setLoaded(true)}
                    className={`object-cover brightness-40 transition-opacity duration-700 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-white text-5xl font-bold hero ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {rightOption.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {gameOver && <GameOverModal onRestart={restartGame} />}
      </div>
    </>
  );
};

export default Game;
