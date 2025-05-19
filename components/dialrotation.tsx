"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

const imageURLs = [
  "https://uxwing.com/wp-content/themes/uxwing/download/transportation-automotive/automobile-icon.svg",
  "https://uxwing.com/wp-content/themes/uxwing/download/internet-network-technology/hobbies-icon.svg",
  "https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/cricket-sport-icon.svg",
  "https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/ball-football-icon.svg",
];

const CircleSpinner = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!circleRef.current) return;

    const circle = circleRef.current;
    const radius = circle.offsetWidth / 2;
    const angleIncrement = (Math.PI * 2) / imageURLs.length;

    const images: HTMLImageElement[] = [];

    imageURLs.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.transformOrigin = "50% 50%";
      img.style.width = "70px";
      img.style.height = "70px";

      const angle = angleIncrement * i;
      gsap.set(img, {
        xPercent: -50,
        yPercent: -50,
        x: radius + Math.cos(angle) * radius,
        y: radius + Math.sin(angle) * radius,
      });

      circle.appendChild(img);
      images.push(img);
    });

    imagesRef.current = images;

    const spin = gsap.timeline({
      repeat: -1,
      defaults: { duration: 50, ease: "none" },
    });

    spin.to(circle, { rotation: 360 }).to(images, { rotation: -360 }, 0);

    const draggableInstance = Draggable.create(circle, {
      type: "rotation",
      inertia: true,
      onThrowUpdate: function () {
        const angle = (this.rotation + 360 * 100000) % 360;
        spin.progress(angle / 360);
      },
      onThrowComplete: () => {
        spin.resume();
        gsap.fromTo(
          spin,
          { timeScale: 0 },
          { duration: 1, timeScale: 1, ease: "power1.in" }
        );
      },
    })[0];

    return () => {
      spin.kill();
      draggableInstance.kill();
      images.forEach((img) => img.remove());
    };
  }, []);

  return (
    <>
      <div
        className="w-80 h-80 relative mx-auto mt-20 mr-130"
        style={{ zIndex: 1, opacity: 0.7 }}
      >
        <div
          ref={circleRef}
          className="main-circle w-full h-full rounded-full relative"
        ></div>

        <style jsx>{``}</style>
      </div>
    </>
  );
};

export default CircleSpinner;
