import { PlayerManager } from "./players";

export class PongGame {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private pm: PlayerManager;

  private ball = { x: 400, y: 250, dx: 4, dy: 4, r: 8 };
  private paddleWidth = 12;
  private paddleHeight = 80;
  private left = { x: 30, y: 210, speed: 6, up: false, down: false };
  private right = { x: 758, y: 210, speed: 6, up: false, down: false };

  private scoreLeft = 0;
  private scoreRight = 0;

  private getMaxScore: () => number;
  private maxScore = 10;
  private gameOver = false;

  private paddleSound = new Audio(
    new URL("./sounds/paddle.mp3", import.meta.url).href
  );

  constructor(canvas: HTMLCanvasElement, pm: PlayerManager, getMaxScore: () => number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.pm = pm;
    this.getMaxScore = getMaxScore;
    this.maxScore = this.getMaxScore();

    this.initControls();
    this.enableSound();
    this.loop();
  }

  private initControls() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "z") this.left.up = true;
      if (e.key === "s") this.left.down = true;
      if (e.key === "o") this.right.up = true;
      if (e.key === "l") this.right.down = true;
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "z") this.left.up = false;
      if (e.key === "s") this.left.down = false;
      if (e.key === "o") this.right.up = false;
      if (e.key === "l") this.right.down = false;
    });
  }

  private enableSound() {
    let soundEnabled = false;
    const activate = () => {
      if (soundEnabled) return;
      soundEnabled = true;
      this.paddleSound.play().catch(() => {});
      this.paddleSound.pause();
      this.paddleSound.currentTime = 0;
    };
    document.addEventListener("click", activate);
    document.addEventListener("keydown", activate);
  }

  private resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    this.ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  private update() {
    if (this.gameOver) return;

    this.maxScore = this.getMaxScore(); // ← dynamique

    const { left, right, ball, paddleHeight, paddleWidth } = this;

    if (left.up) left.y -= left.speed;
    if (left.down) left.y += left.speed;
    if (right.up) right.y -= right.speed;
    if (right.down) right.y += right.speed;

    left.y = Math.max(0, Math.min(this.canvas.height - paddleHeight, left.y));
    right.y = Math.max(0, Math.min(this.canvas.height - paddleHeight, right.y));

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.r < 0 || ball.y + ball.r > this.canvas.height) {
      ball.dy *= -1;
    }

    // Collision raquette gauche
    if (ball.x - ball.r <= left.x + paddleWidth) {
      if (ball.y >= left.y && ball.y <= left.y + paddleHeight) {
        ball.dx = Math.abs(ball.dx);
        this.paddleSound.currentTime = 0;
        this.paddleSound.play();
      }
    }

    // Collision raquette droite
    if (ball.x + ball.r >= right.x) {
      if (ball.y >= right.y && ball.y <= right.y + paddleHeight) {
        ball.dx = -Math.abs(ball.dx);
        this.paddleSound.currentTime = 0;
        this.paddleSound.play();
      }
    }

    // Score Left/Right
    if (ball.x - ball.r < 0) {
      this.scoreRight++;
      this.resetBall();
    }
    if (ball.x + ball.r > this.canvas.width) {
      this.scoreLeft++;
      this.resetBall();
    }

    if (this.scoreLeft >= this.maxScore || this.scoreRight >= this.maxScore) {
      this.gameOver = true;
    }
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Ligne centrale
    ctx.fillStyle = "#30363d";
    for (let i = 0; i < this.canvas.height; i += 20) {
      ctx.fillRect(this.canvas.width / 2 - 1, i, 2, 10);
    }

    // Raquettes
    ctx.fillStyle = "#58a6ff";
    ctx.fillRect(this.left.x, this.left.y, this.paddleWidth, this.paddleHeight);
    ctx.fillRect(this.right.x, this.right.y, this.paddleWidth, this.paddleHeight);

    // Balle
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "#f0f6fc";
    ctx.fill();

    // Score
    const leftPlayer = this.pm.listPlayers()[0]?.name ?? "Joueur G";
    const rightPlayer = this.pm.listPlayers()[1]?.name ?? "Joueur D";

    ctx.fillStyle = "#f0f6fc";
    ctx.font = "20px monospace";
    ctx.fillText(`${leftPlayer}: ${this.scoreLeft}`, 150, 30);
    ctx.fillText(`${rightPlayer}: ${this.scoreRight}`, this.canvas.width - 250, 30);

    // ----------- OVERLAY FIN DE MATCH + BOUTON REJOUER -----------
    if (this.gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "32px monospace";
      ctx.fillText("MATCH TERMINÉ", this.canvas.width / 2 - 150, this.canvas.height / 2 - 20);

      // Création du bouton Rejouer
      if (!document.getElementById("btn-replay")) {
        const btn = document.createElement("button");
        btn.id = "btn-replay";
        btn.textContent = "Rejouer";
        btn.style.position = "absolute";
        btn.style.top = this.canvas.offsetTop + this.canvas.height / 2 + "px";
        btn.style.left = this.canvas.offsetLeft + this.canvas.width / 2 - 60 + "px";
        btn.style.padding = "10px 20px";
        btn.style.fontSize = "16px";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
          btn.remove();
          this.resetBall();
          this.scoreLeft = 0;
          this.scoreRight = 0;
          this.gameOver = false;
        };

        document.body.appendChild(btn);
      }
    }
  }

  private loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}
