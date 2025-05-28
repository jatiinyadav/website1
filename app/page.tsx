"use client";

import Game from "@/components/Game";
import Landing from "@/components/landing";
import data from "../cars.json";
import { useEffect, useState } from "react";

type Comparison = {
  name: string;
  price: number;
  url: string;
  shown?: boolean;
};

export default function Home() {
  const [comparisonData, setComparisonData] = useState<Comparison[]>([]);
  const [showGame, setShowGame] = useState(false);
  const [gameHeader, setGameHeader] = useState("");
  const [gameDescription, setGameDescription] = useState("");

  useEffect(() => {
    const fetchDataForComparison = async () => {
      const initialized = data.map((c: Comparison) => {
        const img = new Image();
        img.src = c.url;
        return {...c, shown: false}
      });
      setComparisonData(initialized);
    };
    fetchDataForComparison();
  }, [data]);

  return (
    <>
      <div className="relative min-h-screen bg">
        {!showGame && (
          <Landing
            setShowGame={setShowGame}
            setGameHeader={setGameHeader}
            setGameDescription={setGameDescription}
          />
        )}
        {showGame && (
          <Game
            dataForComparison={comparisonData}
            header={{
              heading: gameHeader,
              description: gameDescription,
            }}
          />
        )}
      </div>
    </>
  );
}
