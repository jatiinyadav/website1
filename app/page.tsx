"use client";

import Game from "@/components/Game";
import Landing from "@/components/landing";
import { useState } from "react";

export default function Home() {
  const [showGame, setShowGame] = useState(false);
  const [gameHeader, setGameHeader] = useState("");
  const [gameDescription, setGameDescription] = useState("");

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
