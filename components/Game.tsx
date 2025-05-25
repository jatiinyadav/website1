import Image from "next/image";

type Car = {
  name: string;
  price: number;
  url: string;
  shown?: boolean;
};

type StreakCounterProps = {
  leftCar: Car;
  rightCar: Car;
};

const Game: React.FC<StreakCounterProps> = ({ leftCar, rightCar }) => {
  return (
    <>
      <div className="flex h-180 w-380 z-20">
        <div
          className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 hover:border-black border-transparent`}
          style={{ marginRight: "-0.3rem" }}
        >
          <div className="relative w-full h-full">
            <Image
              src={leftCar.url}
              alt={leftCar.name}
              fill
              className="object-cover brightness-40"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold hero">
            {leftCar.name}
          </div>
        </div>

        <div
          className={`w-1/2 h-full relative cursor-pointer border-8 transition-all duration-300 hover:border-black border-transparent"
              transition-all duration-300`}
          style={{ marginLeft: "-0.3rem" }}
        >
          <div className="relative w-full h-full">
            <Image
              src={rightCar.url}
              alt={rightCar.name}
              fill
              className="object-cover brightness-40"
            />
          </div>
          <div className="absolute inset-0 bot flex items-center justify-center text-white text-5xl font-bold hero">
            {rightCar.name}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
