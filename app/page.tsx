"use client"

import { useState } from "react";
import { dummyData } from "../data/allData";

type Item = { name: string; count: number };

export default function Home() {
  const [category, setCategory] = useState<keyof typeof dummyData | null>(null);
  const [winner, setWinner] = useState<Item | null>(null);
  const [nextOpponent, setNextOpponent] = useState<Item | null>(null);
  const [remaining, setRemaining] = useState<Item[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const startGame = (selectedCategory: keyof typeof dummyData) => {
    const shuffled = [...dummyData[selectedCategory]].sort(
      () => 0.5 - Math.random()
    );
    const [first, second, ...rest] = shuffled;
    setCategory(selectedCategory);
    setWinner(first);
    setNextOpponent(second);
    setRemaining(rest);
    setGameOver(false);
    setGameLost(false);
  };

  const handleChoice = (chosen: Item, other: Item) => {
    const correct = chosen.count >= other.count;

    if (!correct) {
      setGameLost(true);
      return;
    }

    const newRemaining = [...remaining];
    const next = newRemaining.shift();

    if (!next) {
      setGameOver(true);
    } else {
      setWinner(chosen);
      setNextOpponent(next);
      setRemaining(newRemaining);
    }
  };

  const restartGame = () => {
    if (category) {
      startGame(category);
    }
  };

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6">
        {Object.keys(dummyData).map((key) => (
          <button
            key={key}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => startGame(key as keyof typeof dummyData)}
          >
            {key}
          </button>
        ))}
      </div>

      {winner && nextOpponent && !gameOver && !gameLost && (
        <div className="flex gap-8">
          {[winner, nextOpponent]
            .sort(() => 0.5 - Math.random())
            .map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  handleChoice(item, item === winner ? nextOpponent : winner)
                }
                className="px-6 py-4 rounded border"
              >
                <div className="text-lg font-semibold">{item.name}</div>
              </button>
            ))}
        </div>
      )}

      {gameOver && (
        <div className="mt-6 text-green-600 text-xl font-bold">
          🎉 You Won! Game Over.
          <br />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      )}

      {gameLost && (
        <div className="mt-6 text-red-600 text-xl font-bold">
          ❌ Wrong Guess! Start Again.
          <br />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={restartGame}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
