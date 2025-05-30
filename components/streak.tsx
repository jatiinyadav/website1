"use client";

import React from "react";

type StreakCounterProps = {
  count: number;
};

const StreakCounter: React.FC<StreakCounterProps> = ({ count }) => {
  return (
    <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-2">
      <img src="/fire.gif" alt="Fire Streak" className="w-10 h-10" />
      <span className="text-white text-3xl font-bold hero">
        <span className="text-xl">x</span> {count}
      </span>
    </div>
  );
};

export default StreakCounter;
