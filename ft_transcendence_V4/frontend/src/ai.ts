export async function getAIMove(ballY: number, paddleY: number) {
  const res = await fetch("http://localhost:8081/?route=ai_move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ballY, paddleY }),
  });
  const data = await res.json();
  return data.move; // "up" or "down"
}

