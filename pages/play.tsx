import { useEffect, useState } from "react";
import "../styles/globals.css";
import GameOverModal from "@/components/gameover";
import StreakCounter from "@/components/streak";
import data from "../cars.json";
import Footer from "@/components/footer";

type Car = {
  name: string;
  price: number;
  url: string;
  shown?: boolean;
};

export default function Play() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [leftCar, setLeftCar] = useState<Car>();
  const [rightCar, setRightCar] = useState<Car>();
  const [resultColor, setResultColor] = useState({ left: "", right: "" });
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        // const response = await fetch(
        //   "https://raw.githubusercontent.com/jatiinyadav/website1/refs/heads/master/cars.json"
        // );
        // if (!response.ok) throw new Error("Failed to fetch data");

        // const data = await response.json();
        const initializedCars = data.map((car: Car) => ({
          ...car,
          shown: false,
        }));
        setCars(initializedCars);
        setCars(data);

        const [a, b] = getTwoRandomCars(initializedCars);
        setLeftCar(a);
        setRightCar(b);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, []);

  const getTwoRandomCars = (carList: Car[]) => {
    const unshown = carList.filter((car) => !car.shown);
    const shuffled = [...unshown].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  };

  const handleSelection = (side: "left" | "right") => {
    if (!leftCar || !rightCar || selected) return;

    const selectedCar = side === "left" ? leftCar : rightCar;
    const otherCar = side === "left" ? rightCar : leftCar;
    const isCorrect = selectedCar.price >= otherCar.price;

    // Set result border color
    setResultColor({
      left:
        side === "left"
          ? isCorrect
            ? "border-green-500"
            : "border-red-500"
          : "border-transparent",
      right:
        side === "right"
          ? isCorrect
            ? "border-green-500"
            : "border-red-500"
          : "border-transparent",
    });

    setSelected(side);

    // Mark both cars as shown
    const updatedCars = cars.map((car) =>
      car.name === leftCar.name || car.name === rightCar.name
        ? { ...car, shown: true }
        : car
    );
    setCars(updatedCars);

    // If wrong, end game after delay
    if (!isCorrect) {
      setTimeout(() => setGameOver(true), 300);
      setStreak(0);
      return;
    }

    setStreak((prev) => prev + 1);

    // Find a new car that hasn’t been shown
    const newCar = updatedCars.find(
      (car) => !car.shown && car.name !== selectedCar.name
    );

    if (!newCar) {
      setTimeout(() => setGameOver(true), 1000);
      return;
    }

    // Replace the incorrect car with new one
    setTimeout(() => {
      if (side === "left") {
        setLeftCar(newCar);
      } else {
        setRightCar(newCar);
      }

      setSelected(null);
      setResultColor({ left: "", right: "" });
    }, 500);
  };

  const restartGame = () => {
    setStreak(0)
    setGameOver(false);
    setSelected(null);
    setResultColor({ left: "", right: "" });
    const initializedCars = cars.map((car: Car) => ({
      ...car,
      shown: false,
    }));
    setCars(initializedCars);
    const [a, b] = getTwoRandomCars(initializedCars);
    setLeftCar(a);
    setRightCar(b);
  };

  return (
    <div className="relative min-h-screen bg">
      <h1 className="text-6xl text-center pt-10 hero text-black">Cars</h1>
      <h1 className="text-4xl text-center pt-5 description text-bold text-black">
        Which car is more expensive? Tap on it!
      </h1>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-14">
        <div className="flex h-170 w-340 z-20">
          <StreakCounter count={streak} />

          {leftCar && (
            <div
              className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 ${
                resultColor.left
                  ? resultColor.left
                  : "hover:border-black border-transparent"
              }`}
              style={{marginRight: "-0.3rem"}}
              onClick={() => handleSelection("left")}
            >
              <img
                src={leftCar.url}
                alt={leftCar.name}
                className="w-full h-full object-cover brightness-40"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold hero">
                {leftCar.name}
              </div>
            </div>
          )}

          {rightCar && (
            <div
              className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 ${
                resultColor.right
                  ? resultColor.right
                  : "hover:border-black border-transparent"
              } transition-all duration-300`}
              style={{marginLeft: "-0.3rem"}}
              onClick={() => handleSelection("right")}
            >
              <img
                src={rightCar.url}
                alt={rightCar.name}
                className="w-full h-full object-cover brightness-40"
              />
              <div className="absolute inset-0 bot flex items-center justify-center text-white text-5xl font-bold hero">
                {rightCar.name}
              </div>
            </div>
          )}

          {gameOver && <GameOverModal onRestart={restartGame} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
