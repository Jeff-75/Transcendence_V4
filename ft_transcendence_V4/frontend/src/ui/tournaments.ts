// src/ui/tournaments.ts
// UI de gestion de tournois via backend Fastify
import { Player } from "../players";

export function initTournamentsUI(pm: any, container: HTMLElement, backendBaseUrl = "http://localhost:8081") {
  const wrapper = document.createElement("div");
  wrapper.style.marginTop = "12px";
  wrapper.style.padding = "8px";
  wrapper.style.background = "rgba(255,255,255,0.02)";
  wrapper.style.borderRadius = "8px";
  container.appendChild(wrapper);

  const title = document.createElement("h3");
  title.textContent = "🏟️ Tournois";
  title.style.marginTop = "0";
  wrapper.appendChild(title);

  const createRow = document.createElement("div");
  createRow.style.display = "flex";
  createRow.style.gap = "6px";
  createRow.style.marginBottom = "8px";
  wrapper.appendChild(createRow);

  const tourNameInput = document.createElement("input");
  tourNameInput.placeholder = "Nom du tournoi";
  tourNameInput.style.flex = "1";
  tourNameInput.style.padding = "4px";
  createRow.appendChild(tourNameInput);

  const createBtn = document.createElement("button");
  createBtn.textContent = "➕ Créer";
  createRow.appendChild(createBtn);

  const listEl = document.createElement("div");
  listEl.style.display = "flex";
  listEl.style.flexDirection = "column";
  listEl.style.gap = "8px";
  wrapper.appendChild(listEl);

  const details = document.createElement("div");
  details.style.marginTop = "10px";
  wrapper.appendChild(details);

  async function fetchTournaments() {
    try {
      const res = await fetch(`${backendBaseUrl}/tournaments`);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  }

  async function createTournament(name: string) {
    const res = await fetch(`${backendBaseUrl}/tournaments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    return res.json();
  }

  async function joinTournament(id: number, playerId: number) {
    return fetch(`${backendBaseUrl}/tournaments/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId })
    }).then(r => r.json());
  }

  async function startTournament(id: number) {
    return fetch(`${backendBaseUrl}/tournaments/${id}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }).then(r => r.json());
  }

  async function getMatches(id: number) {
    const r = await fetch(`${backendBaseUrl}/tournaments/${id}/matches`);
    return r.json();
  }

  async function refresh() {
    listEl.innerHTML = "";
    details.innerHTML = "";

    const tournaments = await fetchTournaments();

    if (!tournaments.length) {
      listEl.innerHTML = "<em>Aucun tournoi</em>";
      return;
    }

    tournaments.forEach((t: any) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "6px";
      row.style.border = "1px solid rgba(255,255,255,0.05)";
      row.style.borderRadius = "6px";

      row.innerHTML = `<strong>${t.name}</strong> (#${t.id})`;

      const actions = document.createElement("div");
      actions.style.display = "flex";
      actions.style.gap = "6px";

      // JOIN DROPDOWN
      const select = document.createElement("select");
      select.innerHTML = `<option value="">Joueur…</option>`;
      pm.listPlayers().forEach((p: Player) => {
        const opt = document.createElement("option");
        opt.value = p.id.toString();
        opt.textContent = p.name;
        select.appendChild(opt);
      });
      actions.appendChild(select);

      const btnJoin = document.createElement("button");
      btnJoin.textContent = "Rejoindre";
      btnJoin.onclick = async () => {
        if (!select.value) return alert("Choisir un joueur");
        await joinTournament(t.id, parseInt(select.value));
        refresh();
      };
      actions.appendChild(btnJoin);

      const btnStart = document.createElement("button");
      btnStart.textContent = "Lancer";
      btnStart.onclick = async () => {
        await startTournament(t.id);
        refresh();
      };
      actions.appendChild(btnStart);

      const btnView = document.createElement("button");
      btnView.textContent = "📄 Matches";
      btnView.onclick = async () => {
        const matches = await getMatches(t.id);
        renderMatches(t, matches);
      };
      actions.appendChild(btnView);

      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  function renderMatches(t: any, matches: any[]) {
    details.innerHTML = `<h4>Matches – ${t.name}</h4>`;
    if (!matches.length) {
      details.innerHTML += "<p>Aucun match encore généré.</p>";
      return;
    }

    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";
    ul.style.display = "flex";
    ul.style.flexDirection = "column";
    ul.style.gap = "6px";

    matches.forEach(m => {
      const li = document.createElement("li");
      li.style.padding = "6px";
      li.style.border = "1px solid rgba(255,255,255,0.05)";
      li.style.borderRadius = "6px";
      li.innerHTML = `<strong>${m.player1}</strong> ${m.score1 ?? "-"} – ${m.score2 ?? "-"} <strong>${m.player2}</strong>`;
      ul.appendChild(li);
    });

    details.appendChild(ul);
  }

  createBtn.onclick = async () => {
    const name = tourNameInput.value.trim();
    if (!name) return alert("Nom vide");
    await createTournament(name);
    tourNameInput.value = "";
    refresh();
  };

  refresh();
}
