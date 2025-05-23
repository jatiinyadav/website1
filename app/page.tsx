"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Buttons from "@/components/buttons";
import PlaneAnimation from "@/components/planeanimation";
import VerticalSpinner from "@/components/verticalspinner";
import HorizontalSpinner from "@/components/horizontalspinner";
import "../styles/globals.css"

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const verticalLeftScroll = useRef<HTMLDivElement>(null);
  const horizontalLeftScroll = useRef<HTMLDivElement>(null);
  const verticalRightScroll = useRef<HTMLDivElement>(null);
  const horizontalRightScroll = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    const lines = ["Easy to Play", "Hard to Survive"];

    // Clear existing content
    headingEl.innerHTML = "";

    // Create block spans for each line
    lines.forEach((line) => {
      const lineSpan = document.createElement("span");
      lineSpan.style.display = "block";
      lineSpan.style.opacity = "0"; // start invisible
      lineSpan.textContent = line;
      headingEl.appendChild(lineSpan);
    });

    const lineSpans = Array.from(headingEl.querySelectorAll("span"));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingEl,
        start: "top 70%",
        toggleActions: "restart none none reverse",
      },
    });

    // Animate fade in line by line
    lineSpans.forEach((lineSpan) => {
      tl.to(lineSpan, { duration: 0.6, opacity: 1, ease: "power1.out" });
    });

    // Fade in description after heading lines
    tl.to(
      planeRef.current,
      { opacity: 1, duration: 1, ease: "power1.out" },
      "-=0.5"
    );
    tl.to(
      [
        descriptionRef.current,
        verticalLeftScroll.current,
        verticalRightScroll.current,
        horizontalLeftScroll.current,
        horizontalRightScroll.current,
      ],
      { opacity: 1, y: 0, duration: 0.6, ease: "power1.out" },
      "-=0.5"
    );
  }, []);

  return (
    <div className="relative min-h-screen bg">
      {/* <Header /> */}
      <div
        className="flex min-h-screen items-center justify-center text-center px-4 text-[#121A2A]"
        style={{ zIndex: 2 }}
      >
        <div>
          <div className="mb-10">
            <h1
              ref={headingRef}
              className="hero text-[2.50rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center"
            ></h1>
          </div>

          <div
            ref={descriptionRef}
            className="opacity-0 translate-y-6"
            style={{ transform: "translateY(24px)" }}
          >
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-10 md:mb-14 text-center description px-4 sm:px-6 md:px-0">
              <p>
                Guess which topic ranks higher and prove you're trend-savvy.
              </p>
              <p>Only 1% get past 10 — are you one of them?</p>
            </div>

            <div className="flex justify-center">
              <Buttons />
            </div>
          </div>
        </div>
      </div>
      
      {/* <div className="opacity-0" ref={planeRef}>
        <PlaneAnimation />
      </div> */}
      <div className="hidden lg:block">
        <div
          className="absolute top-0 left-50 opacity-0"
          ref={verticalLeftScroll}
        >
          <VerticalSpinner direction="down" position="right" offset={160} />
        </div>
        <div
          className="absolute top-0 right-50 opacity-0"
          ref={verticalRightScroll}
        >
          <VerticalSpinner direction="up" position="left" offset={160} />
        </div>
      </div>

      <div className="block lg:hidden">
        <div className="absolute top-0 opacity-0" ref={horizontalLeftScroll}>
          <HorizontalSpinner direction="left" position="top" offset={100} />
        </div>
        <div
          className="absolute bottom-0 opacity-0"
          ref={horizontalRightScroll}
        >
          <HorizontalSpinner direction="right" position="bottom" offset={20} />
        </div>
      </div>

      <Footer />

      <style jsx>
        {`
          .alignInCenter {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}
      </style>
    </div>
  );
}
