let state = "main";
let anaEkran;

let layoutab1, layoutab2, layoutab3, layoutab4, layoutscola, layoutstucen;

let ab1_1, ab1_2, ab1_3;
let ab2_1, ab2_2, ab2_3;
let ab3_1, ab3_2, ab3_3;
let ab4_1, ab4_2, ab4_3;
let scola_1, scola_2, scola_3;
let stucen_1, stucen_2, stucen_3;

let currentLayout;
let currentSounds = [];
let currentSound = null;
let selectedFaculty = "";
let fft;

// Ana ekran görsel butonları
let hotzones = {
  ab1: [130, 100, 140, 70],
  ab2: [130, 200, 150, 70],
  ab3: [130, 400, 150, 70],
  ab4: [100, 600, 140, 70],
  scola: [480, 200, 140, 70],
  stucen: [480, 400, 140, 70]
};


// fakülte layout butonları
let buttonZonesPerFaculty = {
  ab1: [
    [50, 220, 700, 70],
    [50, 360, 700, 70],
    [50, 500, 700, 70]
  ],
  ab2: [
    [50, 220, 700, 70],
    [50, 360, 700, 70],
    [50, 500, 700, 70]
  ],
  ab3: [
    [50, 220, 700, 70],
    [50, 360, 700, 70],
    [50, 500, 700, 70]
  ],
  ab4: [
    [50, 220, 700, 70],
    [50, 360, 700, 70],
    [50, 500, 700, 70]
  ],
  scola: [
    [50, 220, 700, 70],
    [50, 360, 700, 70],
    [50, 500, 700, 70]
  ],
  stucen: [
    [50, 220, 700, 70],
    [50, 360, 700, 70],
    [50, 500, 700, 70]
  ]
};

function preload() {
  anaEkran = loadImage("anaekran.jpg");

  layoutab1 = loadImage("layoutab1.jpg");
  layoutab2 = loadImage("layoutab2.jpg");
  layoutab3 = loadImage("layoutab3.jpg");
  layoutab4 = loadImage("layoutab4.jpg");
  layoutscola = loadImage("layoutscola.jpg");
  layoutstucen = loadImage("layoutstucen.jpg");

  ab1_1 = loadSound("ab1-1.mp3");
  ab1_2 = loadSound("ab1-2.mp3");
  ab1_3 = loadSound("ab1-3.mp3");

  ab2_1 = loadSound("ab2-1.mp3");
  ab2_2 = loadSound("ab2-2.mp3");
  ab2_3 = loadSound("ab2-3.mp3");

  ab3_1 = loadSound("ab3-1.mp3");
  ab3_2 = loadSound("ab3-2.mp3");
  ab3_3 = loadSound("ab3-3.mp3");

  ab4_1 = loadSound("ab4-1.mp3");
  ab4_2 = loadSound("ab4-2.mp3");
  ab4_3 = loadSound("ab4-3.mp3");

  scola_1 = loadSound("scola-1.mp3");
  scola_2 = loadSound("scola-2.mp3");
  scola_3 = loadSound("scola-3.mp3");

  stucen_1 = loadSound("stucen-1.mp3");
  stucen_2 = loadSound("stucen-2.mp3");
  stucen_3 = loadSound("stucen-3.mp3");
}

function setup() {
  createCanvas(800, 800);
  fft = new p5.FFT();
  textFont('Helvetica');
}

function draw() {
  background(0);

  if (state === "main") {
    image(anaEkran, 0, 0, width, height);
  } else if (state === "detail") {
    image(currentLayout, 0, 0, width, height);
    drawSpectrogram();
    drawBackButton();
    drawStopButton();
  }
}

function mousePressed() {
  if (state === "main") {
    for (let fac in hotzones) {
      let [x, y, w, h] = hotzones[fac];
      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        selectedFaculty = fac;
        switch (fac) {
          case "ab1": currentLayout = layoutab1; currentSounds = [ab1_1, ab1_2, ab1_3]; break;
          case "ab2": currentLayout = layoutab2; currentSounds = [ab2_1, ab2_2, ab2_3]; break;
          case "ab3": currentLayout = layoutab3; currentSounds = [ab3_1, ab3_2, ab3_3]; break;
          case "ab4": currentLayout = layoutab4; currentSounds = [ab4_1, ab4_2, ab4_3]; break;
          case "scola": currentLayout = layoutscola; currentSounds = [scola_1, scola_2, scola_3]; break;
          case "stucen": currentLayout = layoutstucen; currentSounds = [stucen_1, stucen_2, stucen_3]; break;
        }
        if (currentSound && currentSound.isPlaying()) currentSound.stop();
        state = "detail";
      }
    }
  } else if (state === "detail") {
    // Geri tuşu
    if (mouseX > width - 100 && mouseX < width - 20 && mouseY > 20 && mouseY < 50) {
      if (currentSound && currentSound.isPlaying()) currentSound.stop();
      state = "main";
      return;
    }

    // Durdur tuşu
    if (currentSound && currentSound.isPlaying() &&
        mouseX > width - 100 && mouseX < width - 20 &&
        mouseY > 60 && mouseY < 90) {
      currentSound.stop();
      return;
    }

    // Ses dalgası tıklamaları
    let zones = buttonZonesPerFaculty[selectedFaculty];
    for (let i = 0; i < zones.length; i++) {
      let [x, y, w, h] = zones[i];
      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        if (currentSound && currentSound.isPlaying()) {
          currentSound.stop();
        }
        currentSound = currentSounds[i];
        currentSound.play();
      }
    }
  }
}

function drawSpectrogram() {
  if (currentSound && currentSound.isPlaying()) {
    let spectrum = fft.analyze();
    let specWidth = width * 0.6; // daha kısa
    let specHeight = 100;
    let xOffset = (width - specWidth) / 2;
    let yBase = height - specHeight - 20;
    let barWidth = specWidth / spectrum.length;

    noStroke();
    fill(255);

    for (let i = 0; i < spectrum.length; i++) {
      let x = xOffset + i * barWidth;
      let h = map(spectrum[i], 0, 255, 0, specHeight);
      rect(x, yBase + (specHeight - h), barWidth, h);
    }

    fill(255);
    textSize(14);
    textAlign(CENTER);
    text(`Time: ${currentSound.currentTime().toFixed(1)}s`, width / 2, yBase - 10);
  }
}


function drawBackButton() {
  let x = width - 100;
  let y = 20;
  let w = 80;
  let h = 30;

  fill(255);
  noStroke();
  rect(x, y, w, h, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("←", x + w / 2, y + h / 2);
}

function drawStopButton() {
  if (currentSound && currentSound.isPlaying()) {
    let x = width - 100;
    let y = 60;
    let w = 80;
    let h = 30;

    fill(255);
    noStroke();
    rect(x, y, w, h, 5);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text("⏯", x + w / 2, y + h / 2);
  }
}
