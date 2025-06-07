// Use a different import style. Instead of a default import,
// we import the entire module's contents into a namespace called 'ThreeDmol'.
import * as ThreeDmol from "3dmol";

console.log("--- 3Dmol Library Import Test ---");
console.log('Logging the imported "ThreeDmol" object:');
console.log(ThreeDmol);

// Let's check if createViewer exists on the imported object.
if (ThreeDmol && ThreeDmol.createViewer) {
  console.log('Success: "createViewer" function found!');

  // Now, run the simplest possible viewer creation logic.
  try {
    const viewerElement = document.querySelector("#viewer-test");
    const viewer = ThreeDmol.createViewer(viewerElement, {
      backgroundColor: "black",
    });

    // Fetch the PDB file from the public folder
    fetch("./public/models/1B68.pdb")
      .then((response) => response.text())
      .then((pdbData) => {
        viewer.addModel(pdbData, "pdb");
        viewer.setStyle({}, { cartoon: { color: "spectrum" } });
        viewer.zoomTo();
        viewer.render();
        viewer.spin(true);
        console.log("Protein model should now be visible.");
      })
      .catch((e) => {
        console.error("Failed to fetch PDB:", e);
        viewerElement.innerHTML = `<p style="color:red;">Error loading PDB file.</p>`;
      });
  } catch (e) {
    console.error("Error during viewer creation:", e);
  }
} else {
  console.error(
    'Failure: "createViewer" function NOT found on the imported object.'
  );
  console.error("This confirms the import method is the issue.");
}
