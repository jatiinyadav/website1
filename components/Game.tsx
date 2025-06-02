import Image from "next/image";
import { useEffect, useState } from "react";
import GameOverModal from "./gameover";
import StreakCounter from "./streak";
import Buttons from "./buttons";
import cars from "../cars.json";
import animals from "../animals.json";
import fruits from "../fruits.json";
import cities from "../cities.json";
import food from "../food.json";

type Comparison = {
  name: string;
  count: number | string;
  url: string;
  shown?: boolean;
};

type Header = {
  heading: string;
  description: string;
};

type StreakCounterProps = {
  header: Header;
};

const Game: React.FC<StreakCounterProps> = ({ header }) => {
  const allDataMap: Record<string, Comparison[]> = {
    cars,
    animals,
    fruits,
    cities,
    food
  };

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
  const [comparison, setComparison] = useState<Comparison[]>(
    allDataMap[header.heading.toLowerCase()]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastCorrectSide, setLastCorrectSide] = useState<
    "left" | "right" | null
  >(null);
  const [gameHeader, setGameHeader] = useState(header.heading);
  const [gameDescription, setGameDescription] = useState(header.description);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    setComparison(allDataMap[gameHeader.toLowerCase()]);
    const [a, b] = getTwoRandomOptions(allDataMap[gameHeader.toLowerCase()]);
    setLeftOption(a);
    setRightOption(b);

    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    setGlobalStreak(0);
  }, [gameHeader]);

  const handleSelection = (side: "left" | "right") => {
    if (!leftOption || !rightOption) return;

    // Check if selected option is correct
    const selected = side === "left" ? leftOption : rightOption;
    const other = side === "left" ? rightOption : leftOption;
    const isCorrect =
      Number(selected.count.toString().replace(/,/g, "")) >=
      Number(other.count.toString().replace(/,/g, ""));

    // Set border color
    setBorderColor({
      leftOptionBorder:
        side === "left"
          ? isCorrect
            ? "text-green-500"
            : "text-red-500"
          : "text-white",
      rightOptionBorder:
        side === "right"
          ? isCorrect
            ? "text-green-500"
            : "text-red-500"
          : "text-white",
    });

    // If wrong, end game after delay
    if (!isCorrect) {
      console.log("Selected Wrong");

      setTimeout(() => setGameOver(true), 500);
      if (globalStreak > highScore) {
        setHighScore(globalStreak);
        localStorage.setItem("highScore", String(globalStreak));
      }
      setGlobalStreak(0);
      return;
    }

    // Update streak counter
    setGlobalStreak((prev) => prev + 1);

    // Update streak and correct side
    const correctSide =
      leftOption.count >= rightOption.count ? "left" : "right";
    const nextStreak = correctSide === lastCorrectSide ? streak + 1 : 1;

    setStreak(nextStreak);
    setLastCorrectSide(correctSide);

    // Decide how to advance the window
    const step = nextStreak >= 2 ? 2 : 1;
    let newIndex = currentIndex + step;
    console.log(newIndex);

    // If no more images to show
    if (newIndex + 1 >= comparison.length) {
      newIndex = 0;
    }

    // Determine next two options
    let nextLeft = comparison[newIndex];
    let nextRight = comparison[newIndex + 1];

    // Flip correct side if streak is 2+
    if (nextStreak >= 2 && lastCorrectSide) {
      const nextCorrect = nextLeft.count >= nextRight.count ? "left" : "right";
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
    }, 800);
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
    const shuffled = [...comparison].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  };

  return (
    <>
      <div className="relative min-h-screen bg">
        <div className="pt-8">
          <Buttons
            gap={false}
            selected={header.heading}
            setGameHeader={setGameHeader}
            setGameDescription={setGameDescription}
          />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center pt-3 sm:pt-5 text-black description">
          {gameDescription}
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
                    className={`object-cover brightness-40 transition-opacity duration-700 hover:brightness-60 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-4xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold hero ${
                    loaded ? "opacity-100" : "opacity-0"
                  } ${
                    borderColor.leftOptionBorder
                      ? `${borderColor.leftOptionBorder}`
                      : `text-white`
                  }`}
                >
                  {leftOption.name}
                </div>
                <div
                  className={`mt-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-xl sm:text-xl md:text-2xl lg:text-4xl font-bold description ${
                    borderColor.leftOptionBorder
                      ? `${borderColor.leftOptionBorder} opacity-100`
                      : `opacity-0`
                  }`}
                >
                  {gameHeader.toLowerCase() === "cars" && "$ "}
                  {leftOption.count}
                  {gameHeader.toLowerCase() === "animals" && " years"}
                  {gameHeader.toLowerCase() === "cities" && " million"}
                  {gameHeader.toLowerCase() === "fruits" && " /100gm"}
                  {gameHeader.toLowerCase() === "food" && " /100gm"}
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
                    className={`object-cover brightness-40 transition-opacity duration-700 hover:brightness-60 ${
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
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-4xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold hero ${
                    loaded ? "opacity-100" : "opacity-0"
                  } ${
                    borderColor.rightOptionBorder
                      ? `${borderColor.rightOptionBorder}`
                      : `text-white`
                  }`}
                >
                  {rightOption.name}
                </div>
                <div
                  className={`mt-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-xl sm:text-xl md:text-2xl lg:text-4xl font-bold description ${
                    borderColor.rightOptionBorder
                      ? `${borderColor.rightOptionBorder} opacity-100`
                      : `opacity-0`
                  }`}
                >
                  {gameHeader.toLowerCase() === "cars" && "$ "}
                  {rightOption.count}
                  {gameHeader.toLowerCase() === "animals" && " years"}
                  {gameHeader.toLowerCase() === "cities" && " million"}
                  {gameHeader.toLowerCase() === "fruits" && " /100gm"}
                  {gameHeader.toLowerCase() === "food" && " /100gm"}
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
