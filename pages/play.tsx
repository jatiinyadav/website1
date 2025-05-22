"use client";

import { useEffect } from "react";

export default function Play() {
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/jatiinyadav/website1/refs/heads/master/cars.json"
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log(data); // Use your data here
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, []);
  return <></>;
}
