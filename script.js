let rating = 0;

const stars = document.querySelectorAll(".stars span");
const emoji = document.getElementById("emoji");
const live = document.getElementById("liveRating");
const emojis = ["😡","😕","😐","😊","😍"];

// 1. Star Click Logic
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    rating = index + 1;

    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add("active");
    }

    emoji.textContent = emojis[rating - 1];
    live.innerText = `⭐ ${rating} / 5`;
  });
});

// 🔥 TELEGRAM CONFIG
const BOT_TOKEN = "8658392704:AAGPui4abxdTL1HjNdmJxJhTVLT6Um3Og-Y";
const CHAT_ID = "5083324379";

// 📊 STORAGE
function getVotes() {
  return JSON.parse(localStorage.getItem("stallVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("stallVotes", JSON.stringify(votes));
}

// 🚀 MAIN SUBMISSION
function submitFeedback() {
  // Grab the elements safely
  const textElement = document.getElementById("text");
  const stallElement = document.getElementById("stall");

  // SAFETY CHECK: If the HTML is missing the ID, stop the code and alert the user.
  if (!textElement || !stallElement) {
    alert("🚨 CACHE ERROR: Your browser is loading an old HTML file! Please clear your browser cache, or ensure your updated index.html is uploaded correctly to your server.");
    return;
  }

  // If we made it here, it's 100% safe to read the values.
  const text = textElement.value;
  const stall = stallElement.value;

  // Validation
  if (!rating || !text || !stall) {
    alert("Please fill all fields, select a stall, and give a star rating!");
    return;
  }

  // ❌ One device, one vote
  if (localStorage.getItem("voted")) {
    alert("❌ Already voted from this device!");
    return;
  }

  // Update Storage
  let votes = getVotes();
  votes[stall] = (votes[stall] || 0) + 1;
  saveVotes(votes);
  localStorage.setItem("voted", true);

  alert("✅ Vote Submitted!");

  // 🏆 Find Leader
  let winner = "";
  let max = 0;

  for (let s in votes) {
    if (votes[s] > max) {
      max = votes[s];
      winner = s;
    }
  }

  // 📲 Send Telegram Message
  let msg = `🗳 Bazaar O Nomics Voting\n\n`;
  msg += `📝 Comment: "${text}"\n\n`;

  for (let s in votes) {
    msg += `🏪 ${s}: ${votes[s]} votes\n`;
  }

  msg += `\n🏆 Leader: ${winner} (${max} votes)`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  }).catch(err => console.error("Telegram error:", err));
}

window.submitFeedback = submitFeedback;
