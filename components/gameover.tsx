"use client";

type GameOverModalProps = {
  onRestart: () => void;
};

export default function GameOverModal({ onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 z-50">
      <div className="bg-[#1d232a] rounded-2xl p-8 shadow-xl text-center max-w-sm w-full">
        <h2 className="text-4xl font-bold text-white mb-4 hero">Game Over</h2>
        <div className="flex gap-10 items-center">
          <p className="text-gray-200 text-xl mb-6 description">
            You gave it your all... and your all gave up. <br />
          </p>
        </div>
        <button
          onClick={onRestart}
          type="button"
          className="cursor-pointer description text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Try again?
        </button>
      </div>
    </div>
  );
}
