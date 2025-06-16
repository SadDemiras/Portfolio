export function makeMenu(p) {
  return {
    startScreenImgRef: null,
    startTextImgRef: null,
    easing: 0.5,
    alpha: 255,
    blinkBack: false,
    load() {
      this.startScreenImgRef = p.loadImage("./assets/Portfolio-.png");
      console.log("Loading start screen image...");
      this.startTextImgRef = p.loadImage("./assets/start.png");
      console.log("Loading start text image...");
      if (!this.startScreenImgRef || !this.startTextImgRef) {
        console.error("Failed to load images. Check file paths.");
      }
    },
    update() {
      if (this.alpha <= 0) this.blinkBack = true;
      if (this.alpha >= 255) this.blinkBack = false;

      if (this.blinkBack) {
        this.alpha += 0.7 * this.easing * p.deltaTime;
      } else {
        this.alpha -= 0.7 * this.easing * p.deltaTime;
      }
    },
    draw() {
      p.clear();
      p.image(this.startScreenImgRef, 0, 0);
      p.tint(255, this.alpha);
      p.image(this.startTextImgRef, 0, 320);
      p.noTint();
    },
  };
}
