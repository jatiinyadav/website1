"use client";

import { useEffect, useState } from "react";
import "../styles/globals.css";
import GameOverModal from "@/components/gameover";

type Car = {
  name: string;
  price: number;
  url: string;
  shown: boolean;
};

export default function Play() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [leftCar, setLeftCar] = useState<Car>();
  const [rightCar, setRightCar] = useState<Car>();
  const [resultColor, setResultColor] = useState({ left: "", right: "" });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/jatiinyadav/website1/refs/heads/master/cars.json"
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
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

    const isLeft = side === "left";
    const selectedCar = isLeft ? leftCar : rightCar;
    const otherCar = isLeft ? rightCar : leftCar;

    const isCorrect = selectedCar.price >= otherCar.price;

    setResultColor({
      left: isLeft ? (isCorrect ? "border-green-500" : "border-red-500") : "",
      right: !isLeft ? (isCorrect ? "border-green-500" : "border-red-500") : "",
    });

    setSelected(side);

    // Mark both as shown
    const updatedCars = cars.map((car) =>
      car.name === leftCar.name || car.name === rightCar.name
        ? { ...car, shown: true }
        : car
    );
    setCars(updatedCars);

    const newCar = updatedCars.find(
      (c) => !c.shown && c.name !== selectedCar.name
    );

    setTimeout(() => {
      if (isCorrect) {
        if (!newCar) {
          // No more unshown cars — consider it game over or victory
          setGameOver(true);
          return;
        }

        // Replace only the incorrect car
        if (isLeft) setRightCar(newCar);
        else setLeftCar(newCar);

        setSelected(null);
      } else {
        // Wrong choice: Game Over
        setGameOver(true);
      }
    }, 1000);
  };

  const restartGame = () => {
    const resetCars = cars.map((car) => ({ ...car, shown: false }));
    setCars(resetCars);
    setGameOver(false);
    setResultColor({ left: "", right: "" });
    getTwoRandomCars(resetCars); // function to set new left/right cars
  };

  return (
    <div className="flex h-screen">
      {/* Left Car */}
      {leftCar && (
        <div
          className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 ${
            resultColor.left ? resultColor.left : "hover:border-white border-transparent"
          }`}
          onClick={() => handleSelection("left")}
        >
          <img
            src={leftCar.url}
            alt={leftCar.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-opacity-30">
            {leftCar.name}
          </div>
        </div>
      )}

      {/* Right Car */}
      {rightCar && (
        <div
          className={`w-1/2 h-full relative cursor-pointer border-8 hover:border-white ${
            resultColor.right ? resultColor.right : "hover:border-white border-transparent"
          } transition-all duration-300`}
          onClick={() => handleSelection("right")}
        >
          <img
            src={rightCar.url}
            alt={rightCar.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-opacity-30">
            {rightCar.name}
          </div>
        </div>
      )}

      {gameOver && <GameOverModal onRestart={restartGame} />}
    </div>
  );
}
