"use client";

import Particles from "react-tsparticles";

export default function ParticlesBackground() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: false,
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          color: { value: "#ffffff" },
          number: { value: 50 },
          size: { value: 2 },
          move: { enable: true, speed: 0.5 },
          opacity: { value: 0.3 },
          links: {
            enable: true,
            color: "#ffffff",
            opacity: 0.2,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
