"use client";

import React from "react";

type StreakCounterProps = {
  count: number;
};

const StreakCounter: React.FC<StreakCounterProps> = ({ count }) => {
  return (
    <div className="absolute left-[47%] top-[2%] bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-30" >
      <img
        src="/fire.gif"
        alt="Fire Streak"
        className="w-10 h-10"
      />
      <span className="text-white text-2xl font-bold hero">{count}</span>
    </div>
  );
};

export default StreakCounter;
