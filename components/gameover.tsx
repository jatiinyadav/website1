"use client";

type GameOverModalProps = {
  onRestart: () => void;
};

export default function GameOverModal({ onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
      <div className="bgGameOver rounded-2xl p-8 shadow-xl text-center max-w-sm w-full">
        <p className="text-5xl text-center glitch mb-4">GAME OVER</p>
        <div className="flex gap-10 items-center">
          <p className="text-gray-200 text-xl mb-6 description">
            You gave it your all... and your all gave up. <br />
          </p>
        </div>
        <button
          onClick={onRestart}
          type="button"
          className="description text-black bg-[#fff8e8] hover:opacity-70 focus:ring-4 focus:outline-none focus:ring-[#3a3a3c] shadow-lg shadow-[#3a3a3c]/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
        >
          Try again?
        </button>
      </div>
    </div>
  );
}
