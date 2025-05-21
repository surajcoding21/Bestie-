let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseX = 0;
  mouseY = 0;
  touchX = 0;
  touchY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updatePosition = (x, y) => {
      if (!this.rotating) {
        this.velX = x - this.prevX;
        this.velY = y - this.prevY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevX = x;
      this.prevY = y;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const updateRotation = (startX, startY, x, y) => {
      const dirX = x - startX;
      const dirY = y - startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }
    };

    // Mouse Events
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (this.holdingPaper) {
        updateRotation(this.touchX, this.touchY, this.mouseX, this.mouseY);
        updatePosition(this.mouseX, this.mouseY);
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.rotating = e.button === 2;

      paper.style.zIndex = highestZ++;
      this.touchX = this.mouseX = e.clientX;
      this.touchY = this.mouseY = e.clientY;
      this.prevX = this.mouseX;
      this.prevY = this.mouseY;
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch Events
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      this.touchX = e.touches[0].clientX;
      this.touchY = e.touches[0].clientY;
      this.prevX = this.touchX;
      this.prevY = this.touchY;

      if (e.touches.length === 2) {
        this.rotating = true;
      }
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      if (this.holdingPaper) {
        updateRotation(this.touchX, this.touchY, x, y);
        updatePosition(x, y);
      }
    }, { passive: false });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// Optional: Prevent right-click context menu (for rotation)
window.addEventListener('contextmenu', e => e.preventDefault());