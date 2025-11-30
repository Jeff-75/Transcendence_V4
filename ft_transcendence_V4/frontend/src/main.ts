import { initUI } from "./ui";
import { PlayerManager } from "./players";

async function main() {
  const pm = new PlayerManager();

  // attends que les joueurs aient été chargés
  await pm.loadFromServer();

  // démarre l'UI avec le PlayerManager
  initUI(pm, document.body, "http://localhost:8081");


}

main();
