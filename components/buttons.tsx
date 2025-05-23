"use client"

import { useRouter } from "next/navigation";

export default function Buttons() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/play");
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 description">
        <button
          type="button"
          className="text-gray-900 bg-[#fff8e6] border-2 border-gray-900 text-sm sm:text-base md:text-md rounded-lg px-6 sm:px-8 py-2 sm:py-2.5"
        >
          Sports
        </button>
        <button
          type="button"
          className="text-gray-900 bg-[#fff8e6] border-2 border-gray-900 text-sm sm:text-base md:text-md rounded-lg px-6 sm:px-8 py-2 sm:py-2.5"
        >
          Movies & TV
        </button>
        <button
          type="button"
          className="text-gray-900 bg-[#fff8e6] border-2 border-gray-900 text-sm sm:text-base md:text-md rounded-lg px-6 sm:px-8 py-2 sm:py-2.5 cursor-pointer"
          onClick={handleClick}
        >
          Cars
        </button>
        <button
          type="button"
          className="text-gray-900 bg-[#fff8e6] border-2 border-gray-900 text-sm sm:text-base md:text-md rounded-lg px-6 sm:px-8 py-2 sm:py-2.5"
        >
          Hollywood
        </button>
        <button
          type="button"
          className="text-gray-900 bg-[#fff8e6] border-2 border-gray-900 text-sm sm:text-base md:text-md rounded-lg px-6 sm:px-8 py-2 sm:py-2.5"
        >
          Bollywood
        </button>
      </div>
    </>
  );
}
