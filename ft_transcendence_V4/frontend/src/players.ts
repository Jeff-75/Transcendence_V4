export interface Player {
  id: number;
  name: string;
}

export class PlayerManager {
  private players: Player[] = [];

  constructor() {
    this.loadFromServer();
  }

  // Charge joueurs depuis le backend
  async loadFromServer() {
    try {
      const res = await fetch("http://localhost:8081/players");
      const data = await res.json();

      if (data?.data) {
        this.players = data.data;
      }
    } catch (e) {
      console.warn("Serveur indisponible, joueurs locaux uniquement.");
    }
  }

  listPlayers() {
    return this.players;
  }

  // Ajout joueur
  async addPlayer(name: string) {
    const clean = name.trim();
    if (!clean) return false;

    try {
      const res = await fetch("http://localhost:8081/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });

      const data = await res.json();
      if (data?.player) {
        this.players.push(data.player);
        return true;
      }
    } catch (e) {
      alert("Erreur réseau — impossible d'ajouter un joueur.");
    }

    return false;
  }

  // Suppression joueur
  async removePlayer(id: number) {
    try {
      await fetch(`http://localhost:8081/players/${id}`, {
        method: "DELETE",
      });

      this.players = this.players.filter((p) => p.id !== id);
    } catch (e) {
      alert("Erreur suppression joueur.");
    }
  }
}
