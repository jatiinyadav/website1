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
  const [globalStreak, setGlobalStreak] = useState(0);
  const [comparison, setComparison] = useState<Comparison[]>(dataForComparison);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastCorrectSide, setLastCorrectSide] = useState<
    "left" | "right" | null
  >(null);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const [a, b] = getTwoRandomOptions(comparison);
    setLeftOption(a);
    setRightOption(b);

    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleSelection = (side: "left" | "right") => {
    if (!leftOption || !rightOption) return;

    // Check if selected option is correct
    const selectedCar = side === "left" ? leftOption : rightOption;
    const otherCar = side === "left" ? rightOption : leftOption;
    const isCorrect = selectedCar.price >= otherCar.price;

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
      console.log("Selected Wrong");

      setTimeout(() => setGameOver(true), 300);
      console.log(streak);
      console.log(highScore);
      if (globalStreak > highScore) {
        setHighScore(globalStreak);
        localStorage.setItem("highScore", String(globalStreak));
      }
      setGlobalStreak(0);
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
    setGlobalStreak((prev) => prev + 1);

    // Update streak and correct side
    const correctSide =
      leftOption.price >= rightOption.price ? "left" : "right";
    const nextStreak = correctSide === lastCorrectSide ? streak + 1 : 1;

    setStreak(nextStreak);
    setLastCorrectSide(correctSide);

    // Decide how to advance the window
    const step = nextStreak >= 2 ? 2 : 1;
    const newIndex = currentIndex + step;

    // If no more images to show
    if (newIndex + 1 >= updatedData.length) {
      console.log("No more images to show");

      setTimeout(() => setGameOver(true), 300);
      if (globalStreak > highScore) {
        setHighScore(globalStreak);
        localStorage.setItem("highScore", String(globalStreak));
      }
      return;
    }

    // Determine next two options
    let nextLeft = updatedData[newIndex];
    let nextRight = updatedData[newIndex + 1];

    // Flip correct side if streak is 2+
    if (nextStreak >= 2 && lastCorrectSide) {
      const nextCorrect = nextLeft.price >= nextRight.price ? "left" : "right";
      if (nextCorrect === lastCorrectSide) {
        // flip
        [nextLeft, nextRight] = [nextRight, nextLeft];
      }
    }

    // Replace the incorrect car with new one
    setTimeout(() => {
      setLeftOption(nextLeft);
      setRightOption(nextRight);
      setCurrentIndex(newIndex);
      setBorderColor({ leftOptionBorder: "", rightOptionBorder: "" });
    }, 300);
  };

  const restartGame = () => {
    setGlobalStreak(0);
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center pt-4 sm:pt-6 text-black font-bold hero">
          {header.heading}
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center pt-3 sm:pt-5 text-black description">
          {header.description}
        </h2>

        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-[20%] bottom-0">
          <div className="flex flex-col md:flex-row justify-center items-center min-w-screen h-[80vh] z-20">
            <StreakCounter count={globalStreak} />
            {leftOption && (
              <div
                className={`w-full h-full relative cursor-pointer transition-all duration-300`}
                onClick={() => handleSelection("left")}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={leftOption.url}
                    alt={leftOption.name}
                    fill
                    unoptimized
                    priority
                    loading="eager"
                    onLoad={() => setLoaded(true)}
                    className={`object-cover brightness-40 transition-opacity duration-700 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-white text-4xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold hero ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {leftOption.name}
                </div>
                <div
                  className={`absolute top-0 w-full text-left text-white text-3xl hero p-2 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  High Score : {highScore}
                </div>
                <div
                  className={`absolute bottom-0 w-full text-left text-white text-sm description pl;-2 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Image
                </div>
              </div>
            )}

            {rightOption && (
              <div
                className={`w-full h-full relative cursor-pointer transition-all duration-300`}
                onClick={() => handleSelection("right")}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={rightOption.url}
                    alt={rightOption.name}
                    fill
                    unoptimized
                    priority
                    loading="eager"
                    onLoad={() => setLoaded(true)}
                    className={`object-cover brightness-40 transition-opacity duration-700 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-white text-4xl sm:text-3xl md:text-4xl lg:text-6xl font-bold hero ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {rightOption.name}
                </div>
                <div
                  className={`absolute bottom-0 w-full text-left text-white text-sm description pl-2 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Image
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
