
async function askAI(){
  const question = document.getElementById("question").value;

  const response = await fetch("http://localhost:5000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();
  document.getElementById("answer").innerText = data.answer;
}
