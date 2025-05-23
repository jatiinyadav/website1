"use client";

type GameOverModalProps = {
  onRestart: () => void;
};

export default function GameOverModal({ onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over</h2>
        <p className="text-gray-600 mb-6">You selected the wrong car!</p>
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
