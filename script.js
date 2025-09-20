document.getElementById('calculate-btn').addEventListener('click', function() {
  const atomicNumberInput = document.getElementById('atomic-number');
  const atomicNumber = parseInt(atomicNumberInput.value);

  // Input validation
  if (isNaN(atomicNumber) || atomicNumber < 1 || atomicNumber > 118) {
      alert("الرجاء إدخال عدد ذري صحيح بين 1 و 118.");
      return;
  }

  // Show results container
  document.getElementById('results-container').style.display = 'block';

  // Data for orbitals: name, capacity, number of boxes
  const orbitalOrder = [
      { name: '1s', capacity: 2, boxes: 1 },
      { name: '2s', capacity: 2, boxes: 1 },
      { name: '2p', capacity: 6, boxes: 3 },
      { name: '3s', capacity: 2, boxes: 1 },
      { name: '3p', capacity: 6, boxes: 3 },
      { name: '4s', capacity: 2, boxes: 1 },
      { name: '3d', capacity: 10, boxes: 5 },
      { name: '4p', capacity: 6, boxes: 3 },
      { name: '5s', capacity: 2, boxes: 1 },
      { name: '4d', capacity: 10, boxes: 5 },
      { name: '5p', capacity: 6, boxes: 3 },
      { name: '6s', capacity: 2, boxes: 1 },
      { name: '4f', capacity: 14, boxes: 7 },
      { name: '5d', capacity: 10, boxes: 5 },
      { name: '6p', capacity: 6, boxes: 3 },
      { name: '7s', capacity: 2, boxes: 1 },
      { name: '5f', capacity: 14, boxes: 7 },
      { name: '6d', capacity: 10, boxes: 5 },
      { name: '7p', capacity: 6, boxes: 3 },
  ];

  let remainingElectrons = atomicNumber;
  let standardConfig = '';
  let orbitalDiagramHTML = '';

  for (const orbital of orbitalOrder) {
      if (remainingElectrons <= 0) break;

      const electronsInOrbital = Math.min(remainingElectrons, orbital.capacity);

      // 1. Build Standard Configuration String
      standardConfig += `${orbital.name}<sup>${electronsInOrbital}</sup> `;

      // 2. Build Orbital Diagram HTML
      orbitalDiagramHTML += generateOrbitalBoxes(orbital.name, orbital.boxes, electronsInOrbital);

      remainingElectrons -= electronsInOrbital;
  }

  // Display results
  document.getElementById('standard-config').innerHTML = standardConfig.trim();
  document.getElementById('orbital-diagram').innerHTML = orbitalDiagramHTML;
});

function generateOrbitalBoxes(name, numBoxes, electrons) {
  let html = `<div class="subshell"><span class="orbital-label">${name}</span>`;
  let boxesContent = Array(numBoxes).fill('');

  // Hund's Rule: Fill singly first
  for (let i = 0; i < numBoxes && electrons > 0; i++) {
      if (electrons > 0) {
          boxesContent[i] += '↑';
          electrons--;
      }
  }

  // Pauli Exclusion Principle: Pair up with opposite spin
  for (let i = 0; i < numBoxes && electrons > 0; i++) {
      if (electrons > 0) {
          boxesContent[i] += '↓';
          electrons--;
      }
  }

  // Create the HTML for the boxes
  for (const content of boxesContent) {
      html += `<div class="orbital">${content}</div>`;
  }

  html += `</div>`;
  return html;
}