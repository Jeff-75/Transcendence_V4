// src/ui.ts
import { PongGame } from "./game";
import { initTournamentsUI } from "./ui/tournaments";

export function initUI(pm: any, container: HTMLElement, backendBaseUrl = "http://localhost:8081") {
  // --- Layout global ---
  const layout = document.createElement("div");
  layout.style.display = "grid";
  layout.style.gridTemplateColumns = "220px 1fr 260px";
  layout.style.height = "100vh";
  layout.style.background = "#0d1117";
  layout.style.color = "white";
  layout.style.fontFamily = "monospace";
  layout.style.gap = "10px";
  layout.style.padding = "10px";

  container.appendChild(layout);

  //
  // ─────────────────────────────────────────────
  //  PANEL JOUEURS (gauche)
  // ─────────────────────────────────────────────
  //
  const playerPanel = document.createElement("div");
  playerPanel.style.background = "#112240";
  playerPanel.style.padding = "12px";
  playerPanel.style.borderRadius = "10px";
  layout.appendChild(playerPanel);

  const title = document.createElement("h2");
  title.textContent = "🏆 Joueurs";
  playerPanel.appendChild(title);

  // Input + bouton
  const input = document.createElement("input");
  input.placeholder = "Nom du joueur";
  input.style.width = "120px";
  input.style.padding = "5px";
  playerPanel.appendChild(input);

  const addBtn = document.createElement("button");
  addBtn.textContent = "Ajouter";
  addBtn.style.marginLeft = "5px";
  playerPanel.appendChild(addBtn);

  // Liste joueurs
  const list = document.createElement("ul");
  list.style.marginTop = "10px";
  list.style.listStyle = "none";
  playerPanel.appendChild(list);

  async function refreshPlayers() {
    await pm.loadFromServer();
    list.innerHTML = "";
    pm.listPlayers().forEach((p: any) => {
      const li = document.createElement("li");
      li.textContent = p.name;
      list.appendChild(li);
    });
  }

  addBtn.onclick = async () => {
    const name = input.value.trim();
    if (!name) return alert("Nom vide");
    await pm.addPlayer(name);
    input.value = "";
    refreshPlayers();
  };

  refreshPlayers();


  //
  // ─────────────────────────────────────────────
  //  ZONE DE JEU (centre)
  // ─────────────────────────────────────────────
  //
  const gamePanel = document.createElement("div");
  gamePanel.style.display = "flex";
  gamePanel.style.justifyContent = "center";
  gamePanel.style.alignItems = "center";
  gamePanel.style.background = "#0b0f14";
  gamePanel.style.borderRadius = "10px";
  layout.appendChild(gamePanel);

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 500;
  canvas.style.border = "2px solid #58a6ff";
  gamePanel.appendChild(canvas);

  //
  // ─────────────────────────────────────────────
  //  PANEL SCORE + TOURNOIS (droite)
  // ─────────────────────────────────────────────
  //
  const rightPanel = document.createElement("div");
  rightPanel.style.background = "#112240";
  rightPanel.style.padding = "12px";
  rightPanel.style.borderRadius = "10px";
  rightPanel.style.display = "flex";
  rightPanel.style.flexDirection = "column";
  rightPanel.style.gap = "15px";
  layout.appendChild(rightPanel);

 const scoreTitle = document.createElement("h2");
scoreTitle.textContent = "📊 Score";
rightPanel.appendChild(scoreTitle);

// ------- Choix du score max ----------
const maxScoreLabel = document.createElement("label");
maxScoreLabel.textContent = "Score max : ";
maxScoreLabel.style.display = "block";
maxScoreLabel.style.marginTop = "5px";

const maxScoreSelect = document.createElement("select");
[5, 10, 15, 21].forEach(v => {
  const o = document.createElement("option");
  o.value = v.toString();
  o.textContent = v.toString();
  maxScoreSelect.appendChild(o);
});
maxScoreSelect.value = "10";

maxScoreLabel.appendChild(maxScoreSelect);
rightPanel.appendChild(maxScoreLabel);

// On garde le scoreBox
const scoreBox = document.createElement("div");
scoreBox.textContent = "Les scores seront affichés ici…";
scoreBox.style.fontSize = "14px";
scoreBox.style.color = "#ccc";
rightPanel.appendChild(scoreBox);

  //
  // ─── module tournois (UI externe) ─────────────
  //
  const tournamentsPanel = document.createElement("div");
  rightPanel.appendChild(tournamentsPanel);

  initTournamentsUI(pm, tournamentsPanel, backendBaseUrl);


 new PongGame(canvas, pm, () => parseInt(maxScoreSelect.value)); // ← lance le jeu Pong
}
