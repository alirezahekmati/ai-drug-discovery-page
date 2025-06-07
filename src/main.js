import "./style.css";
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import * as ThreeDmol from "3dmol";
import { Chart, registerables } from "chart.js";

gsap.registerPlugin(ScrollTrigger, TextPlugin);
Chart.register(...registerables);

const GENE_TARGETS = ["APOE4", "PSEN1", "APP", "TREM2"];
const SELECTED_TARGET = "APOE4";
const PROTOCOL_TEXT = `[BEGIN PROTOCOL: CANDIDATE_A7-22_SYNTHESIS]<br>
-------------------------------------------- <br>
1.  Prepare Reagents:<br>
    - Thaw Candidate #A7-22 plasmid (50 ng/μL).<br>
    - Prepare 500 mL of LB media. <br>
2.  Transformation:<br>
    - Add 2 μL of plasmid to 50 μL of E. coli cells.<br>
    - Heat shock at 42°C for 45 seconds.<br>
3.  Expression:<br>
    - Inoculate 100 mL of LB media.<br>
    - Grow at 37°C until OD600 reaches 0.6.<br>
    - Induce with 1 mM IPTG.<br>
4.  Purification:<br>
    - Harvest cells via centrifugation.<br>
    - Purify using Ni-NTA chromatography.<br>
5.  Validation:<br>
    - Confirm via SDS-PAGE.<br>
    - Store at -80°C.<br>
--------------------------------------------<br>
[END PROTOCOL]`;
let validationChart = null;
let viewerInstance = null;

function create3DViewer() {
  if (viewerInstance) {
    viewerInstance.spin(true);
    return;
  }
  try {
    const viewerElement = document.querySelector("#protein-viewer");
    if (!viewerElement) return;
    viewerElement.innerHTML = "";
    const viewer = ThreeDmol.createViewer(viewerElement, {
      backgroundColor: "black",
    });
    fetch("../public/models/1b68.pdb")
      .then((r) => r.text())
      .then((pdbData) => {
        viewer.addModel(pdbData, "pdb");
        viewer.setStyle({}, { cartoon: { color: "spectrum" } });
        viewer.zoomTo();
        viewer.render();
        viewer.zoom(1.2, 1000);
        viewer.spin(true);
        viewerInstance = viewer;
      })
      .catch((e) => console.error("PDB loading failed:", e));
  } catch (e) {
    console.error("3D viewer init failed:", e);
  }
}

function stop3DViewer() {
  if (viewerInstance) viewerInstance.spin(false);
}

function createValidationChart() {
  const ctx = document.getElementById("validation-chart");
  if (!ctx) return;
  if (validationChart) validationChart.destroy();
  const data = {
    labels: [
      "Binding Affinity",
      "Stability",
      "Specificity",
      "Solubility",
      "Novelty",
    ],
    datasets: [
      {
        label: "Score",
        data: [95, 88, 75, 92, 85],
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        borderColor: "rgba(0, 255, 255, 1)",
        pointBackgroundColor: "rgba(0, 255, 255, 1)",
      },
    ],
  };
  const options = {
    scales: {
      r: {
        angleLines: { color: "rgba(255, 255, 255, 0.2)" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        pointLabels: {
          color: "#e0e0e0",
          font: { size: 14, family: "'Space Grotesk', sans-serif" },
        },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: { legend: { display: false } },
    animation: { duration: 1500 },
  };
  validationChart = new Chart(ctx, { type: "radar", data, options });
}

function typeProtocol() {
  const codeElement = document.querySelector(".protocol-body code");
  if (!codeElement) return;
  codeElement.classList.remove("typing-complete");
  gsap.to(codeElement, {
    duration: 8,
    text: PROTOCOL_TEXT,
    ease: "none",
    // onComplete: () => {
    //   let finalHtml = codeElement.innerHTML.replace(
    //     /\\*\\*(.*?)\\*\\*/g,
    //     "<strong>$1</strong>"
    //   );
    //   codeElement.innerHTML = finalHtml;
    //   codeElement.classList.add("typing-complete");
  // },
  });
}

async function main() {
  await loadSlim(tsParticles);
  await tsParticles.load({
    id: "tsparticles",
    options: {
      background: { color: { value: "#0d0d1a" } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 140, links: { opacity: 1 } },
          push: { quantity: 4 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        collisions: { enable: true },
        move: {
          direction: "none",
          enable: true,
          outModes: "out",
          random: false,
          speed: 0.5,
          straight: false,
        },
        number: { density: { enable: true }, value: 80 },
        opacity: { value: 0.2 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    },
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#section-1",
        start: "top bottom",
        end: "top top",
        scrub: 1,
      },
    })
    .to(
      [".title", ".subtitle", ".scroll-down-indicator", ".genesis-particle"],
      { opacity: 0, y: -30, stagger: 0.1 }
    )
    .to(".terminal-window", { opacity: 1, scale: 1, duration: 1 }, ">-0.5");
  ScrollTrigger.create({
    trigger: "#section-1",
    start: "top center",
    once: true,
    onEnter: () => {
      gsap.to("#terminal-text", {
        duration: 3,
        text: "> Please identify therapeutic targets associated with Alzheimer's disease and propose potential drug candidates aimed at addressing these targets. <br>><br>>Initializing query...<br>> Found 4 potential targets. <br>> APOE4 seems the best one between them",
        ease: "none",
        onComplete: () => {
          const c = document.querySelector(".targets-container");
          c.innerHTML = "";
          GENE_TARGETS.forEach((t) => {
            const e = document.createElement("div");
            e.className = "gene-target";
            e.innerText = t;
            if (t === SELECTED_TARGET) e.classList.add("selected");
            c.appendChild(e);
          });
          gsap.to(".gene-target", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.2,
            onComplete: () => {
              gsap.to(".gene-target.selected", {
                repeat: -1,
                yoyo: true,
                scale: 1.1,
                duration: 0.8,
                borderColor: "#ff00ff",
                color: "#ff00ff",
              });
            },
          });
        },
      });
    },
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#section-2",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onEnter: () => create3DViewer(),
        onLeave: () => stop3DViewer(),
        onEnterBack: () => create3DViewer(),
        onLeaveBack: () => stop3DViewer(),
      },
    })
    .to([".terminal-window", ".targets-container"], { opacity: 0, scale: 0.9 })
    .to(".viewer-container", { opacity: 1, scale: 1, duration: 1 }, ">-0.5");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#section-3",
        start: "top bottom",
        end: "top top",
        scrub: 1,
      },
    })
    .to(".viewer-container", { opacity: 0, scale: 0.9 })
    .to(".validation-container", { opacity: 1, y: 0, duration: 1 }, ">-0.5")
    .call(createValidationChart, [], ">");

  // *** THE MODIFIED TIMELINE IS HERE ***
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#section-4",
        start: "top center", // Animation plays when the section is centered
        once: true, // This ensures the animation only runs once
      },
    })
    .to(".validation-container", { opacity: 0, y: -50, duration: 0.5 })
    .to(
      ".protocol-container",
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
      ">-0.5"
    )
    .call(typeProtocol, [], ">-0.5");
}

document.addEventListener("DOMContentLoaded", main);
