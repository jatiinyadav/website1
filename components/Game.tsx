import Image from "next/image";
import { useState } from "react";

type Comparison = {
  name: string;
  price: number;
  url: string;
  shown?: boolean;
};

type Header = {
  heading: string;
  description: string;
};

type StreakCounterProps = {
  leftItem: Comparison;
  rightItem: Comparison;
  header: Header;
};

const Game: React.FC<StreakCounterProps> = ({
  leftItem,
  rightItem,
  header,
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <div className="relative min-h-screen bg">
        <h1 className="text-6xl text-center pt-10 hero text-black">
          {header.heading}
        </h1>
        <h1 className="text-4xl text-center pt-5 description text-bold text-black">
          {header.description}
        </h1>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-14">
          <div className="flex h-180 w-380 z-20">
            <div
              className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 hover:border-black border-transparent`}
              style={{ marginRight: "-0.3rem" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={leftItem.url}
                  alt={leftItem.name}
                  fill
                  onLoadingComplete={() => setLoaded(true)}
                  className={`object-cover brightness-40 transition-opacity duration-700 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div
                className={`absolute inset-0 bot flex items-center justify-center text-white text-5xl font-bold hero ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {leftItem.name}
              </div>
            </div>

            <div
              className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 hover:border-black border-transparent"
              transition-all duration-300`}
              style={{ marginLeft: "-0.3rem" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={rightItem.url}
                  alt={rightItem.name}
                  fill
                  onLoadingComplete={() => setLoaded(true)}
                  className={`object-cover brightness-40 transition-opacity duration-700 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div
                className={`absolute inset-0 bot flex items-center justify-center text-white text-5xl font-bold hero ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {rightItem.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
