

import "./src/style.css";
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

// This is a simplified script that only loads the animated background.
// It's used by about.html and contact.html.
async function initializeParticles() {
  await loadSlim(tsParticles);
  await tsParticles.load({
    id: "tsparticles",
    options: {
      background: {
        color: {
          value: "#0d0d1a",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 1,
            },
          },
          push: {
            quantity: 4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: "out",
          random: false,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.2,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    },
  });
}

document.addEventListener("DOMContentLoaded", initializeParticles);
