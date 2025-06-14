import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GameOverModal from "./gameover";
import StreakCounter from "./streak";
import Buttons from "./buttons";
import cars from "../cars.json";
import animals from "../animals.json";
import fruits from "../fruits.json";
import cities from "../cities.json";
import food from "../food.json";
import Loading1 from "../public/images/loading/loadingImage1.webp";
import Loading2 from "../public/images/loading/loadingImage1.webp";

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
    food,
  };

  const [loaded, setLoaded] = useState(false);
  const [leftOption, setLeftOption] = useState<Comparison | null>();
  const [rightOption, setRightOption] = useState<Comparison | null>();
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
  const [lastCorrectSide, setLastCorrectSide] = useState<
    "left" | "right" | null
  >(null);
  const [gameHeader, setGameHeader] = useState(header.heading);
  const [gameDescription, setGameDescription] = useState(header.description);
  const [highScore, setHighScore] = useState(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = comparison?.length || 0;
  const shownPairs = useRef<Set<string>>(new Set());

  useEffect(() => {
    setLeftOption(null);
    setRightOption(null);
    setLoaded(false);
    setLoadedCount(0);

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

  useEffect(() => {
    if (loadedCount === totalImages && totalImages > 0) {
      setLoaded(true);
    }
  }, [loadedCount, totalImages]);

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

    // Create a function to get a unique random pair
    const getNextPair = () => {
      const maxAttempts = 50;
      for (let i = 0; i < maxAttempts; i++) {
        const idx1 = Math.floor(Math.random() * comparison.length);
        let idx2 = Math.floor(Math.random() * comparison.length);
        while (idx1 === idx2) {
          idx2 = Math.floor(Math.random() * comparison.length);
        }

        const key = `${Math.min(idx1, idx2)}-${Math.max(idx1, idx2)}`;
        if (!shownPairs.current.has(key)) {
          shownPairs.current.add(key);
          return [comparison[idx1], comparison[idx2]];
        }
      }

      // If all combinations shown or too many retries, reset
      shownPairs.current.clear();
      return getNextPair();
    };

    // Determine next two options
    let [nextLeft, nextRight] = getNextPair();

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
      {comparison?.map((item, index) => (
        <Image
          key={`preload-${index}`}
          src={item.url}
          alt={`Preload ${index}`}
          width={0}
          height={0}
          priority
          unoptimized
          style={{
            opacity: 0,
            position: "absolute",
            pointerEvents: "none",
          }}
          onLoad={() => setLoadedCount((prev) => prev + 1)}
        />
      ))}
      <div className="relative flex justify-center w-full min-h-screen bg">
        <div className="absolute z-21 bg-white/1 rounded-b-[2rem] backdrop-blur-md p-4">
          <div>
            <div>
              <Buttons
                gap={false}
                selected={header.heading}
                setGameHeader={setGameHeader}
                setGameDescription={setGameDescription}
              />
            </div>
            <h2 className="text-md sm:text-xl lg:text-2xl text-center sm:pt-2 text-white description">
              {gameDescription}
            </h2>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col md:flex-row justify-center items-center min-w-screen h-[100vh] z-20">
            {(leftOption || rightOption) && (
              <StreakCounter count={globalStreak} />
            )}
            {leftOption && loaded && (
              <div
                className={`w-full h-full relative cursor-pointer transition-all duration-300 brightness-80 ease-out hover:brightness-100`}
                onClick={() => handleSelection("left")}
              >
                <div
                  className={`relative w-full h-full transition-opacity duration-700 ease-out ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={leftOption.url}
                    alt={leftOption.name}
                    fill
                    unoptimized
                    priority
                    loading="eager"
                    onLoadingComplete={() => setLoaded(true)}
                    className="object-cover brightness-40"
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
                  className={`absolute w-full text-left text-white text-3xl hero p-2 ${
                    loaded ? "opacity-100" : "opacity-0"
                  } bottom-0 md:top-0 md:bottom-auto`}
                >
                  High Score : {highScore}
                </div>
                <div
                  className={`absolute bottom-0 w-full text-right text-white text-sm description pl;-2 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Image Src: Unsplash
                </div>
              </div>
            )}

            {!loaded && (
              <div
                className={`w-full h-full relative cursor-pointer transition-all duration-300 ease-out`}
              >
                <div
                  className={`relative w-full h-full bg-black transition-opacity duration-700 ease-out`}
                >
                  <Image
                    src={Loading1}
                    alt="loading..."
                    fill
                    unoptimized
                    priority
                    loading="eager"
                    className="object-cover brightness-20"
                  />
                </div>
                <div
                  className={`brightness-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-4xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold hero text-white`}
                >
                  Loading...
                </div>
              </div>
            )}

            {rightOption && loaded && (
              <div
                className={`w-full h-full relative cursor-pointer transition-all duration-300 brightness-80 ease-out hover:brightness-100`}
                onClick={() => handleSelection("right")}
              >
                <div
                  className={`relative w-full h-full bg-black transition-opacity duration-700 ease-out ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={rightOption.url}
                    alt={rightOption.name}
                    fill
                    unoptimized
                    priority
                    loading="eager"
                    onLoadingComplete={() => setLoaded(true)}
                    className="object-cover brightness-40"
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
                  className={`absolute bottom-0 w-full text-right text-white text-sm description pl-2 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Image src: Unsplash
                </div>
              </div>
            )}

            {!loaded && (
              <div
                className={`w-full h-full relative cursor-pointer transition-all duration-300`}
              >
                <div
                  className={`relative w-full h-full bg-black transition-opacity duration-700 ease-out`}
                >
                  <Image
                    src={Loading2}
                    alt="loading..."
                    fill
                    unoptimized
                    priority
                    loading="eager"
                    className="object-cover brightness-20"
                  />
                </div>
                <div
                  className={`brightness-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-4xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold hero text-white`}
                >
                  Loading...
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
